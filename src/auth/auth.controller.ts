import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto, SignupDto } from './dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Signup a new user',
    description: 'Create a new account',
  })
  @ApiResponse({ type: LoginResponseDto, status: 201 })
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
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
