import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { CreateFormDto, UpdateFormDto } from './dto/';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FormService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createFormDto: CreateFormDto,
    userId: string,
    userEmail: string,
  ) {
    const slug = await this.generateUniqueSlug();

    const form = await this.prisma.form.create({
      data: {
        ...createFormDto,
        targetEmail: userEmail,
        slug,
        userId,
      },
    });

    return form;
  }

  findAll() {
    return `This action returns all form`;
  }

  findOne(id: number) {
    return `This action returns a #${id} form`;
  }

  update(id: number, updateFormDto: UpdateFormDto) {
    return `This action updates a #${id} form`;
  }

  remove(id: number) {
    return `This action removes a #${id} form`;
  }

  private async generateUniqueSlug(): Promise<string> {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const slug = `form-${randomBytes(5)
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
