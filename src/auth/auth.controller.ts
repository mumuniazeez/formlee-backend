import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  LoginDto,
  LoginResponseDto,
  RequestResetPasswordLinkDto,
  ResetPasswordDto,
  SignupDto,
} from './dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { GetUser } from './decorators/get-user.decorators';
import { GeneralOkResponseDto } from '../common/dto';
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
  @ApiResponse({ type: LoginResponseDto, status: 200 })
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 300000, limit: 5, blockDuration: 900000 } })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({
    summary: 'Change a user account password',
    description: 'Change a user account password',
  })
  @ApiResponse({ type: GeneralOkResponseDto, status: 200 })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 300000, limit: 3, blockDuration: 900000 } })
  @UseGuards(JwtGuard)
  @Post('recovery/change-password')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser('id') userId: string,
  ) {
    return this.authService.changePassword(changePasswordDto, userId);
  }

  @ApiOperation({
    summary: 'Request password reset',
    description: 'Request password reset link',
  })
  @ApiResponse({ type: GeneralOkResponseDto, status: 200 })
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 300000, limit: 3, blockDuration: 900000 } })
  @Post('recover/reset-password-link')
  requestResetPasswordLink(
    @Body() requestResetPasswordLinkDto: RequestResetPasswordLinkDto,
    @Ip() requestIp: string,
  ) {
    return this.authService.requestResetPasswordLink(
      requestResetPasswordLinkDto,
      requestIp,
    );
  }

  @ApiOperation({
    summary: 'Verify request password reset',
    description: 'Verify request password reset link',
  })
  @ApiResponse({ type: GeneralOkResponseDto, status: 200 })
  @Get('recover/verify-reset-password-link')
  verifyResetPasswordLink(@Query('token') token: string) {
    return this.authService.verifyResetPasswordLink(token);
  }

  @ApiOperation({
    summary: 'Reset Password',
    description: 'Reset Password',
  })
  @ApiResponse({ type: GeneralOkResponseDto, status: 200 })
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 300000, limit: 3, blockDuration: 900000 } })
  @Post('recover/reset-password-link')
  resetPassword(@Body() resetPasswordLinkDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordLinkDto);
  }
}
