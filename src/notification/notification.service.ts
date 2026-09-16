import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { NOTIFICATION_QUEUE } from './notification.module';
import { Queue } from 'bullmq';

export interface NewSubmissionJsonData {
  submissionId: string;
  formId: string;
}

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue(NOTIFICATION_QUEUE)
    private readonly notificationQueue: Queue<NewSubmissionJsonData>,
  ) {}

  async notifyNewSubmission(data: NewSubmissionJsonData) {
    await this.notificationQueue.add('new-submission', data);
  }
}
