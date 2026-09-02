import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailerService extends Resend {
  constructor(private readonly config: ConfigService) {
    super(config.get('RESEND_API_KEY'));
  }

  async sendEmail({
    to,
    html,
    subject,
    from,
  }: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }) {
    try {
      await this.emails.send({ to, from: from || 'ss', html, subject });
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
