import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../generated/prisma';

export class UserResponseDto implements Omit<User, 'passwordHash'> {
  @ApiProperty({ description: 'The id of the user' })
  id!: string;
  @ApiProperty({ description: 'The first name of the user' })
  firstName!: string;
  @ApiProperty({ description: 'The last name of the user' })
  lastName!: string;
  @ApiProperty({ description: 'The email address of the user' })
  email!: string;
  @ApiProperty({
    description: 'The creation date of the user account',
  })
  createdAt!: Date;
  @ApiProperty({
    description: 'The last time the user account was updated',
  })
  updatedAt!: Date;
}
