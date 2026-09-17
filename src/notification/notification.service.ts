import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { NOTIFICATION_QUEUE } from './notification.constants';

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
