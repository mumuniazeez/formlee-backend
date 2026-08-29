import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Form } from '../../../generated/prisma';

class FormCountResponse {
  @ApiProperty({ description: 'Total number of submission' })
  submissions!: number;
}

export class FormResponseDto implements Form {
  @ApiProperty({ description: 'Id of the from' })
  id!: string;

  @ApiProperty({ description: 'a short id for this from, used for submission' })
  slug!: string;

  @ApiProperty({ description: 'Name of the from' })
  name!: string;

  @ApiProperty({
    description: 'Description of the from',
    type: 'string',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({ description: 'Status of the from', enum: $Enums.FormStatus })
  status!: $Enums.FormStatus;

  @ApiProperty({
    description: 'The email to deliver submission notification to',
  })
  targetEmail!: string;

  @ApiProperty({ description: 'Email submission notification status' })
  emailNotification!: boolean;

  @ApiProperty({
    description: 'Link to redirect user to after successful submission',
    type: 'string',
    nullable: true,
  })
  redirectLink!: string | null;

  @ApiProperty({ description: 'Id of the owner of the from' })
  userId!: string;

  @ApiProperty({
    description: 'Counts of relations to form',
    type: FormCountResponse,
  })
  _count!: FormCountResponse;

  @ApiProperty({ description: 'Date the  from was created' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last date the form was updated' })
  updatedAt!: Date;
}
