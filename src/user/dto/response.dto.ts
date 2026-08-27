import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../generated/prisma';

export class UserResponseDto implements Omit<User, 'passwordHash'> {
  @ApiProperty({ type: 'string', description: 'The id of the user' })
  id!: string;
  @ApiProperty({ type: 'string', description: 'The first name of the user' })
  firstName!: string;
  @ApiProperty({ type: 'string', description: 'The last name of the user' })
  lastName!: string;
  @ApiProperty({ type: 'string', description: 'The email address of the user' })
  email!: string;
  @ApiProperty({
    type: 'string',
    description: 'The creation date of the user account',
  })
  createdAt!: Date;
  @ApiProperty({
    type: 'string',
    description: 'The last time the user account was updated',
  })
  updatedAt!: Date;
}
