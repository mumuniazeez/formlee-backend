import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorators/get-user.decorators';
import { UpdateUserDto, UserResponseDto } from './dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { GeneralOkResponseDto } from '../dto';
import { type User } from '../../generated/prisma';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get user profile',
    description: 'Get the current authenticated user profile',
  })
  @ApiResponse({ type: UserResponseDto, status: 200 })
  @Get('me')
  getUser(@GetUser() user: User) {
    return user;
  }

  @ApiOperation({
    summary: 'Update user profile',
    description: 'Update the current authenticated user profile',
  })
  @ApiResponse({ type: UserResponseDto, status: 200 })
  @Patch('me')
  updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser('id') userId: string,
  ) {
    return this.userService.updateProfile(updateUserDto, userId);
  }

  @ApiOperation({
    summary: 'Delete user profile',
    description: 'Delete the current authenticated user profile',
  })
  @ApiResponse({ type: GeneralOkResponseDto, status: 200 })
  @Delete('me')
  deleteProfile(@GetUser('id') userId: string) {
    return this.userService.deleteProfile(userId);
  }
}
