import { ApiProperty, PickType } from '@nestjs/swagger';
import { Submission } from '../../../generated/prisma';
import { type JsonValue } from '../../../generated/prisma/runtime/client';
import { FormResponseDto } from '../../form/dto';

class SubmissionFormDto extends PickType(FormResponseDto, [
  'name',
  'id',
  'slug',
  'description',
]) {}
export class SubmissionResponseDto implements Submission {
  @ApiProperty({ description: 'Id of the submission' })
  id!: string;
  @ApiProperty({
    description:
      'Email from the submission fields, if the field "email" exists',
    type: 'string',
    nullable: true,
  })
  email!: string | null;
  @ApiProperty({
    description: 'Country of the user that submitted the form',
    type: 'string',
    nullable: true,
  })
  country!: string;
  @ApiProperty({
    description: 'IP address of the user that submitted the form',
    type: 'string',
    nullable: true,
  })
  ip!: string;
  @ApiProperty({
    description: 'JSON payload of the form data',
    nullable: true,
  })
  payload!: JsonValue;
  @ApiProperty({
    description: 'Id of the form this submission is under',
    nullable: true,
  })
  formId!: string;

  @ApiProperty({
    description: 'Id of the form this submission is under',
    type: SubmissionFormDto,
  })
  form!: SubmissionFormDto;

  @ApiProperty({
    description: 'The time this submission was made',
    nullable: true,
  })
  submittedAt!: Date;
  @ApiProperty({
    description: 'The last time this submission was updated',
    nullable: true,
  })
  updatedAt!: Date;
}
