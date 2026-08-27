import { User } from '../../../generated/prisma';

export class CreateUserDto implements Pick<User, 'firstName' | 'lastName'> {
  firstName!: string;
  lastName!: string;
}
