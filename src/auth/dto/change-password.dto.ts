import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
