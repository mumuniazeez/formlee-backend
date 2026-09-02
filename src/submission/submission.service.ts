import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SubmissionResponseDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { GeneralOkResponseDto } from '../dto';
import { type Request } from 'express';
import { MailerService } from '../mailer/mailer.service';
import handlebars from 'handlebars';
import { readFileSync } from 'fs';
import path from 'path';
import { FieldFormatterService } from './field-formatter.service';

@Injectable()
export class SubmissionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly fieldFormatterService: FieldFormatterService,
  ) {}

  async create(
    data: any,
    formSlug: string,
    req: Request,
  ): Promise<SubmissionResponseDto> {
    const form = await this.prisma.form.findUnique({
      where: { slug: formSlug },
      select: { id: true, status: true, targetEmail: true },
    });

    if (!form) throw new NotFoundException('Form not found');
    if (form.status !== 'active')
      throw new NotFoundException('Form not currently active');

    const email: string = data.email;
    const ipAddress = req.ip!;
    const userAgent = req.headers['user-agent']!;

    console.log({ email, ipAddress, userAgent });
    const filePath = path.join('emails', `submission.hbs`);
    try {
      const submission = await this.prisma.submission.create({
        data: {
          userAgent,
          email,
          country: 'Nigeria',
          data,
          ipAddress,
          formId: form.id,
        },
        include: {
          form: {
            select: {
              id: true,
              slug: true,
              name: true,
              description: true,
              redirectLink: true,
            },
          },
        },
      });
      await this.mailerService.sendEmail({
        to: form.targetEmail,
        subject: `New submission for form [${formSlug}] | Formlee`,
        html: handlebars.compile(readFileSync(filePath, 'utf-8'))({
          formName: submission.form.name,
          submittedAt: new Date(submission.submittedAt).toLocaleString(),
          fields: this.fieldFormatterService.format(
            submission.data as Record<string, unknown>,
          ),
          ipAddress,
          referer: 'yourclientsite.com',
          dashboardUrl:
            'https://formlee.app/dashboard/forms/abc123/submissions/xyz',
          manageNotificationsUrl:
            'https://formlee.app/dashboard/forms/abc123/settings',
        }),
      });

      return submission;
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Error sending email: ' + error.message,
      );
    }
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
          select: {
            name: true,
            id: true,
            slug: true,
            description: true,
            redirectLink: true,
          },
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
          select: {
            name: true,
            id: true,
            slug: true,
            description: true,
            redirectLink: true,
          },
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
