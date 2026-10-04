import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserResponseDto } from '../user/dto';
import { FormResponseDto } from '../form/dto';
import { FormStatus } from '../../generated/prisma';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }
  async getAllForms(): Promise<FormResponseDto[]> {
    const forms = await this.prisma.form.findMany({
      include: { _count: { select: { submissions: true } } },
    });

    return forms;
  }

  async changeFormStatus(
    formId: string,
    status: FormStatus,
  ): Promise<FormResponseDto> {
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
      select: { id: true },
    });

    if (!form) throw new NotFoundException('Form not found');

    return this.prisma.form.update({
      where: {
        id: form.id,
      },
      data: {
        status,
      },
      include: { _count: { select: { submissions: true } } },
    });
  }
}
