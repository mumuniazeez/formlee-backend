import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Old password of the user',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  oldPassword!: string;

  @ApiProperty({
    description: 'New password of the user',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  newPassword!: string;
}

export class RequestResetPasswordLinkDto {
  @ApiProperty({
    description: 'Email of the account',
    type: 'string',
  })
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'New password to change to',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  newPassword!: string;

  @ApiProperty({
    description: 'Token sent to the user email',
    type: 'string',
  })
  @IsJWT()
  token!: string;
}
