import { Module } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { FieldFormatterService } from './field-formatter.service';

@Module({
  controllers: [SubmissionController],
  providers: [SubmissionService, FieldFormatterService],
})
export class SubmissionModule {}
