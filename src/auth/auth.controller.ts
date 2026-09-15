import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  LoginDto,
  LoginResponseDto,
  SignupDto,
} from './dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { GetUser } from './decorators/get-user.decorators';
import { GeneralOkResponseDto } from '../dto';
import { JwtGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Signup a new user',
    description: 'Create a new account',
  })
  @ApiResponse({ type: LoginResponseDto, status: 201 })
  @Throttle({ default: { ttl: 300000, limit: 5, blockDuration: 900000 } })
  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @ApiOperation({
    summary: 'Login a user account',
    description: 'Login a new use, get an access token',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: LoginResponseDto, status: 200 })
  @Throttle({ default: { ttl: 300000, limit: 5, blockDuration: 900000 } })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({
    summary: 'Change a user account password',
    description: 'Change a user account password',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GeneralOkResponseDto, status: 200 })
  @ApiBearerAuth()
  @Throttle({ default: { ttl: 300000, limit: 3, blockDuration: 900000 } })
  @UseGuards(JwtGuard)
  @Post('recovery/change-password')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser('id') userId: string,
  ) {
    return this.authService.changePassword(changePasswordDto, userId);
  }
}
