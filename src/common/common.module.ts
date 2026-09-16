import { Module } from '@nestjs/common';
import { FieldFormatterService } from './field-formatter.service';

@Module({
  providers: [FieldFormatterService],
  exports: [FieldFormatterService],
})
export class CommonModule {}
