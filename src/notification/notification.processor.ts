import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import { FieldFormatterService } from '../common/field-formatter.service';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { NOTIFICATION_QUEUE } from './notification.constants';
import { Job } from 'bullmq';
import { NewSubmissionJsonData } from './notification.service';
import path from 'path';
import { readFileSync } from 'fs';
import handlebars from 'handlebars';

@Processor(NOTIFICATION_QUEUE)
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly fieldFormatterService: FieldFormatterService,
  ) {
    super();
  }

  async process(job: Job<NewSubmissionJsonData>) {
    const { formId, submissionId } = job.data;

    const [submission, form] = await Promise.all([
      this.prisma.submission.findFirstOrThrow({ where: { id: submissionId } }),
      this.prisma.form.findUniqueOrThrow({ where: { id: formId } }),
    ]);

    if (!form.emailNotification)
      return this.logger.log(
        `Skipping notification for form ${form.id}: email notification disabled `,
      );

    const filePath = path.join('emails', `submission.hbs`);

    await this.mailerService.sendEmail({
      to: form.targetEmail,
      subject: `New submission for form [${form.slug}] | Formlee`,
      html: handlebars.compile(readFileSync(filePath, 'utf-8'))({
        formName: form.name,
        submittedAt: new Date(submission.submittedAt).toLocaleString(),
        fields: this.fieldFormatterService.format(
          submission.data as Record<string, unknown>,
        ),
        ipAddress: submission.ipAddress,
        referer: submission.referrer,
        dashboardUrl:
          'https://formlee.app/dashboard/forms/abc123/submissions/xyz',
        manageNotificationsUrl:
          'https://formlee.app/dashboard/forms/abc123/settings',
      }),
    });
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<NewSubmissionJsonData>, error: Error) {
    this.logger.error(
      `Notification job ${job.id} failed (attempt ${job.attemptsMade}/${job.opts.attempts}: ${error.message})`,
    );
  }

  @OnWorkerEvent('completed')
  onComplete(job: Job<NewSubmissionJsonData>) {
    this.logger.log(
      `Notification sent for submission ${job.data.submissionId}`,
    );
  }
}
