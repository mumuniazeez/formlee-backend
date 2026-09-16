import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { BullModule } from '@nestjs/bullmq';
import { NotificationProcessor } from './notification.processor';
import { FieldFormatterService } from '../submission/field-formatter.service';

export const NOTIFICATION_QUEUE = 'notification';

@Module({
  imports: [
    BullModule.registerQueue({
      name: NOTIFICATION_QUEUE,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 500,
        removeOnFail: 1000,
      },
    }),
  ],
  providers: [
    NotificationService,
    NotificationProcessor,
    FieldFormatterService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
