import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailerService extends Resend {
  constructor(private readonly config: ConfigService) {
    super(config.get('RESEND_API_KEY'));
  }

  async sendEmail({
    subject,
    to,
    html,
    from,
  }: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }) {
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const { error } = await this.emails.send({
          from: from || this.config.get('RESEND_FROM_EMAIL')!,
          to,
          subject,
          html,
        });

        if (error) {
          throw new Error(error.message);
        }

        return { success: true };
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw error;
        }
      }
    }
  }
}
