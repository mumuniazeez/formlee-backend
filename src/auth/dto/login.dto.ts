import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email of the user',
    type: 'string',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Password of the user',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
