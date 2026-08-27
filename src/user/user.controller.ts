import { Body, Controller, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorators/get-user.decorators';
import { UpdateUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('me')
  updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser('id') userId: string,
  ) {
    return this.userService.updateProfile(updateUserDto, userId);
  }
}
