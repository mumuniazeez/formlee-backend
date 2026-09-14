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
import axios from 'axios';

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

    const filePath = path.join('emails', `submission.hbs`);

    const response = await axios.get<{
      country: string;
      city: string;
      region: string;
    }>(`https://ipwho.is/${ipAddress}`);

    const submission = await this.prisma.submission.create({
      data: {
        userAgent,
        email,
        country: `${response.data.city}, ${response.data.region}, ${response.data.country}`,
        data,
        ipAddress,
        formId: form.id,
        referer: req.headers.referer,
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
    try {
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
          referer: submission.referer,
          dashboardUrl:
            'https://formlee.app/dashboard/forms/abc123/submissions/xyz',
          manageNotificationsUrl:
            'https://formlee.app/dashboard/forms/abc123/settings',
        }),
      });

      return submission;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Submission Recorded, failed to send email notification',
      );
    }
  }

  async findRecent(userId: string): Promise<SubmissionResponseDto[]> {
    const submissions = await this.prisma.submission.findMany({
      where: {
        form: { userId },
      },
      orderBy: {
        submittedAt: 'desc',
      },
      take: 5,
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

  async markAsRead(id: string, userId: string): Promise<SubmissionResponseDto> {
    const submission = await this.prisma.submission.findFirst({
      where: { id, form: { userId } },
      select: { id: true },
    });

    if (!submission) throw new NotFoundException('Submission not found');

    return this.prisma.submission.update({
      where: { id: submission.id },
      data: { read: true },
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
