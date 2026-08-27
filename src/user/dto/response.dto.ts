import { User } from '../../../generated/prisma';

export class UserResponseDto implements User {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  passwordHash!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
