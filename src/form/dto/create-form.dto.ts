import { IsString } from 'class-validator';
import { Form } from '../../../generated/prisma';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFormDto implements Pick<Form, 'name' | 'description'> {
  @ApiProperty({
    description: 'The name to give the form',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Description for the form',
    type: 'string',
  })
  @IsString()
  description!: string;
}
