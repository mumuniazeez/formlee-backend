import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto, UserResponseDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateProfile(
    updateUserDto: UpdateUserDto,
    userId: string,
  ): Promise<UserResponseDto> {
    const userProfile = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userProfile) throw new NotFoundException('User account not found');

    return this.prisma.user.update({
      data: { ...updateUserDto },
      where: { id: userId },
    });
  }
}
