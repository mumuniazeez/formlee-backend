import { Module } from '@nestjs/common';
import { PolarService } from './polar.service';
import { PolarController } from './polar.controller';

@Module({
  controllers: [PolarController],
  providers: [PolarService],
})
export class PolarModule {}
