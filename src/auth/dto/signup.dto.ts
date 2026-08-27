import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { LoginDto } from './login.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignupDto extends IntersectionType(LoginDto) {
  @ApiProperty({
    description: 'Firstname of the user',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({
    description: 'Lastname of the user',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  lastName!: string;
}
