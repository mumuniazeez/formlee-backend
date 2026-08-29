import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateFormDto } from './create-form.dto';
import { $Enums } from '../../../generated/prisma';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateFormDto extends PartialType(CreateFormDto) {
  @ApiProperty({
    required: false,
    description: 'Status of the form',
    enum: $Enums.FormStatus,
  })
  @IsEnum($Enums.FormStatus)
  @IsOptional()
  status?: $Enums.FormStatus;

  @ApiProperty({
    required: false,
    description: 'Change target email',
  })
  @IsString()
  @IsOptional()
  targetEmail?: string;

  @ApiProperty({
    required: false,
    description: 'Enable or disable email notification',
  })
  @IsBoolean()
  @IsOptional()
  emailNotification?: boolean;

  @ApiProperty({
    required: false,
    description: 'Change redirect URL',
  })
  @IsString()
  @IsOptional()
  redirectUrl?: string;
}
