import { IsOptional, IsString } from 'class-validator';
import { Form } from '../../../generated/prisma';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFormDto implements Pick<Form, 'name' | 'description'> {
  @ApiProperty({
    description: 'The name to give the form',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'An optional description for the form',
    required: false,
    type: 'string',
  })
  @IsString()
  @IsOptional()
  description!: string | null;
}
