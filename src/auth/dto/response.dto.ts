import { PickType } from '@nestjs/swagger';
import { UserResponseDto } from '../../user/dto';

class LoginUserResponseDto extends PickType(UserResponseDto, ['id', 'email']) {}

export class LoginResponseDto {
  user!: LoginUserResponseDto;
  access_token!: string;
  message!: string;
}
