import { Module } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [SubmissionController],
  providers: [SubmissionService],
})
export class SubmissionModule {}
