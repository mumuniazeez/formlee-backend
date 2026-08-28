import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../generated/prisma';

export class CreateUserDto implements Pick<User, 'firstName' | 'lastName'> {
  @ApiProperty({ description: 'The first name of the user' })
  firstName!: string;
  @ApiProperty({ description: 'The last name of the user' })
  lastName!: string;
}
