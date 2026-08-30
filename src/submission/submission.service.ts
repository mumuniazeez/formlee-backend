import { Injectable, NotFoundException } from '@nestjs/common';
import { SubmissionResponseDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { GeneralOkResponseDto } from '../dto';

@Injectable()
export class SubmissionService {
  constructor(private readonly prisma: PrismaService) {}

  create(createSubmissionDto: JSON) {
    return 'This action adds a new submission';
  }

  async findAll(
    formIdOrSlug: string,
    userId: string,
  ): Promise<SubmissionResponseDto[]> {
    const form = await this.prisma.form.findFirst({
      where: { OR: [{ id: formIdOrSlug }, { slug: formIdOrSlug }], userId },
      select: { id: true },
    });

    if (!form) throw new NotFoundException('Form not found');

    const submissions = await this.prisma.submission.findMany({
      where: { formId: form.id },
      include: {
        form: {
          select: { name: true, id: true, slug: true, description: true },
        },
      },
    });

    if (submissions.length === 0)
      throw new NotFoundException('No submissions yet');

    return submissions;
  }

  async findOne(id: string, userId: string): Promise<SubmissionResponseDto> {
    const submission = await this.prisma.submission.findFirst({
      where: { id, form: { userId } },
      include: {
        form: {
          select: { name: true, id: true, slug: true, description: true },
        },
      },
    });

    if (!submission) throw new NotFoundException('Submission not found');

    return submission;
  }

  async remove(id: string, userId: string): Promise<GeneralOkResponseDto> {
    const submission = await this.prisma.submission.findFirst({
      where: { id, form: { userId } },
      select: { id: true },
    });

    if (!submission) throw new NotFoundException('Submission not found');

    await this.prisma.submission.delete({ where: { id } });

    return { message: 'Submission deleted successfully' };
  }
}
