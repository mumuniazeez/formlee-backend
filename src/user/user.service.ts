import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto, UserResponseDto } from './dto';
import { GeneralOkResponseDto } from '../dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateProfile(
    updateUserDto: UpdateUserDto,
    userId: string,
  ): Promise<UserResponseDto> {
    return this.prisma.user.update({
      data: { ...updateUserDto },
      where: { id: userId },
    });
  }

  async deleteProfile(userId: string): Promise<GeneralOkResponseDto> {
    await this.prisma.user.delete({ where: { id: userId } });

    return { message: 'User account deleted successfully' };
  }
}
