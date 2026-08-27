import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserResponseDto } from '../../user/dto';

class LoginUserResponseDto extends PickType(UserResponseDto, ['id', 'email']) {}

export class LoginResponseDto {
  @ApiProperty({ type: LoginUserResponseDto })
  user!: LoginUserResponseDto;
  @ApiProperty({
    type: 'string',
    description: 'The access token to send authenticated request',
  })
  access_token!: string;
  @ApiProperty({
    type: 'string',
    description: 'A short message about your request',
  })
  message!: string;
}
