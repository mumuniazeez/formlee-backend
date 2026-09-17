import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';

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
  @IsEmail()
  email!: string;

  @IsUrl({ require_tld: false })
  callbackUrl!: string;
}
