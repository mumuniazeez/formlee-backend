import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ChangePasswordDto,
  LoginDto,
  LoginResponseDto,
  RequestResetPasswordLinkDto,
  ResetPasswordDto,
  SignupDto,
} from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '../mailer/mailer.service';
import { PaymentService } from '../payment/payment.service';
import { GeneralOkResponseDto } from '../common/dto';
import path from 'path';
import handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mailer: MailerService,
    private readonly paymentService: PaymentService,
  ) {}

  async signup(signupDto: SignupDto): Promise<LoginResponseDto> {
    const { firstName, lastName, email, password } = signupDto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser)
      throw new ConflictException('User account already exists');

    const passwordHash = await hash(password);

    const user = await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
      },
    });

    const polarCustomer =
      await this.paymentService.registerCustomerOnPolar(user);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { polar_customer_id: polarCustomer.id },
    });

    await this.mailer.contacts.create({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return this.login({ email: user.email, password });
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { passwordHash: true, email: true, id: true },
    });

    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await verify(user.passwordHash, password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid email or password');

    const tokenData = {
      id: user.id,
      email: user.email,
    };

    const token = this.jwt.sign(tokenData, {
      secret: this.config.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: '10days',
    });

    return {
      user: { id: user.id, email: user.email },
      access_token: token,
      message: "Yay, You're in",
    };
  }

  // TODO: Implement password reset

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    userId: string,
  ): Promise<GeneralOkResponseDto> {
    const { oldPassword, newPassword } = changePasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, passwordHash: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await verify(user.passwordHash, oldPassword);

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid Old Password');

    const newPasswordHash = await hash(newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    return { message: 'Password Changed Successfully' };
  }

  // TODO: Implement change password

  async requestResetPasswordLink(
    requestResetPasswordLinkDto: RequestResetPasswordLinkDto,
    requestIp: string,
  ): Promise<GeneralOkResponseDto> {
    // get  user details
    const user = await this.prisma.user.findUnique({
      where: { email: requestResetPasswordLinkDto.email },
    });
    // check if user exist
    if (!user) throw new NotFoundException('User account not found');

    // get the email ready

    const resetTokenData: {
      userId: string;
      email: string;
    } = {
      userId: user.id,
      email: user.email,
    };

    const resetToken = this.jwt.sign(resetTokenData, {
      secret: this.config.get('JWT_PASSWORD_RESET_TOKEN_SECRET'),
      expiresIn: '10m',
    });

    const filePath = path.join('emails', `password-recovery.hbs`);

    // send email

    await this.mailer.sendEmail({
      to: user.email,
      subject: 'Reset your password | Formlee',
      html: handlebars.compile(readFileSync(filePath, 'utf-8'))({
        firstName: user.firstName,
        email: user.email,
        resetUrl: `${this.config.get('FRONTEND_URL')}/reset-password?token=${resetToken}`,
        expiresInMinutes: 10,
        requestIp,
        requestedAt: new Date(),
        dashboardUrl: `${this.config.get('FRONTEND_URL')}/dashboard`,
      }),
    });

    await this.prisma.passwordResetRequest.create({
      data: { token: resetToken, userId: user.id },
    });

    return { message: 'Password Reset Link Sent' };
  }

  async verifyResetPasswordLink(token: string): Promise<GeneralOkResponseDto> {
    const passwordResetRequest =
      await this.prisma.passwordResetRequest.findFirst({
        where: {
          token,
          createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
        },
      });

    if (!passwordResetRequest)
      throw new UnauthorizedException('Link have expired');

    return { message: 'Link still valid' };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<GeneralOkResponseDto> {
    const passwordResetRequest =
      await this.prisma.passwordResetRequest.findFirst({
        where: {
          token: resetPasswordDto.token,
          createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
        },
      });

    if (!passwordResetRequest)
      throw new UnauthorizedException('Link have expired');

    const tokenData = this.jwt.verify<{
      userId: string;
      email: string;
    }>(passwordResetRequest.token, {
      secret: this.config.get('JWT_PASSWORD_RESET_TOKEN_SECRET'),
    });

    const user = await this.prisma.user.findUnique({
      where: { id: tokenData.userId },
    });

    if (!user) throw new NotFoundException('User account not found');

    const passwordHash = await hash(resetPasswordDto.newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
      },
    });

    await this.prisma.passwordResetRequest.delete({
      where: { id: passwordResetRequest.id },
    });

    return { message: 'Password has been reset successfully' };
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async invalidateResetPasswordRequestJob() {
    await this.prisma.passwordResetRequest.deleteMany({
      where: {
        createdAt: { lte: new Date(Date.now() - 10 * 60 * 1000) },
      },
    });
  }
}
