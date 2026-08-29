import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { CreateFormDto, FormResponseDto, UpdateFormDto } from './dto/';
import { PrismaService } from '../prisma/prisma.service';
import { GeneralOkResponseDto } from '../dto';
import { $Enums } from '../../generated/prisma';

@Injectable()
export class FormService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createFormDto: CreateFormDto,
    userId: string,
    userEmail: string,
  ): Promise<FormResponseDto> {
    const slug = await this.generateUniqueSlug();

    const form = await this.prisma.form.create({
      data: {
        ...createFormDto,
        targetEmail: userEmail,
        slug,
        userId,
      },
      include: { _count: { select: { submissions: true } } },
    });

    return form;
  }

  async findAll(userId: string): Promise<FormResponseDto[]> {
    const forms = await this.prisma.form.findMany({
      where: { userId },
      include: { _count: { select: { submissions: true } } },
    });

    if (forms.length === 0) throw new NotFoundException('No form created yet');

    return forms;
  }

  async findAllByStatus(
    userId: string,
    status: $Enums.FormStatus,
  ): Promise<FormResponseDto[]> {
    const forms = await this.prisma.form.findMany({
      where: { userId, status },
      include: { _count: { select: { submissions: true } } },
    });

    if (forms.length === 0) throw new NotFoundException('No forms found');

    return forms;
  }

  async findOne(idOrSlug: string, userId: string): Promise<FormResponseDto> {
    const form = await this.prisma.form.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }], userId },
      include: { _count: { select: { submissions: true } } },
    });

    if (!form) throw new NotFoundException('Form not found');

    return form;
  }

  async update(
    idOrSlug: string,
    updateFormDto: UpdateFormDto,
    userId: string,
  ): Promise<FormResponseDto> {
    const form = await this.prisma.form.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }], userId },
      select: { id: true },
    });

    if (!form) throw new NotFoundException('Form not found');

    return this.prisma.form.update({
      where: { id: form.id },
      data: { ...updateFormDto },
      include: { _count: { select: { submissions: true } } },
    });
  }

  async remove(
    idOrSlug: string,
    userId: string,
  ): Promise<GeneralOkResponseDto> {
    const form = await this.prisma.form.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }], userId },
      select: { id: true },
    });

    if (!form) throw new NotFoundException('Form not found');

    await this.prisma.form.delete({
      where: { id: form.id },
    });

    return { message: 'Form deleted successfully' };
  }

  private async generateUniqueSlug(): Promise<string> {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const slug = `form_${randomBytes(5)
        .toString('base64url')
        .replace(/[-_]/g, '')
        .slice(0, 10)}`;

      const existingForm = await this.prisma.form.findUnique({
        where: { slug },
      });

      if (!existingForm) {
        return slug;
      }
    }

    throw new Error('Unable to generate a unique form slug');
  }
}
