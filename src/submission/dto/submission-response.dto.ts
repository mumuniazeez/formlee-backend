import { ApiProperty, PickType } from '@nestjs/swagger';
import { Submission } from '../../../generated/prisma';
import { type JsonValue } from '../../../generated/prisma/runtime/client';
import { FormResponseDto } from '../../form/dto';

class SubmissionFormDto extends PickType(FormResponseDto, [
  'name',
  'id',
  'slug',
  'description',
  'redirectLink',
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
  })
  country!: string;
  @ApiProperty({
    description: 'IP address of the user that submitted the form',
    type: 'string',
  })
  ipAddress!: string;
  @ApiProperty({
    description: 'JSON payload of the form data',
  })
  data!: JsonValue;
  @ApiProperty({
    description: 'Id of the form this submission is under',
  })
  formId!: string;

  @ApiProperty({
    description: 'Id of the form this submission is under',
    type: SubmissionFormDto,
  })
  form!: SubmissionFormDto;

  @ApiProperty({
    description: 'Browser user-agent of the submitter',
  })
  userAgent!: string;
  @ApiProperty({
    description: 'If submission as been read',
  })
  read!: boolean;

  @ApiProperty({
    description: 'The time this submission was made',
  })
  submittedAt!: Date;
}
