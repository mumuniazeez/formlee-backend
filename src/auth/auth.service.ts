import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, LoginResponseDto, SignupDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signup(signupDto: SignupDto) {
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

    return { user, access_token: token, message: "Yay, You're in" };
  }
}
