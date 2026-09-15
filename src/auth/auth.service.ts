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
  SignupDto,
} from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '../mailer/mailer.service';
import { PaymentService } from '../payment/payment.service';
import { GeneralOkResponseDto } from '../dto';

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

  // TODO: Implement change password

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    userId: string,
  ): Promise<GeneralOkResponseDto> {
    const { oldPassword, newPassword } = changePasswordDto;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
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
}
