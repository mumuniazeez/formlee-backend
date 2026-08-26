import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaClient } from '../../generated/prisma/client';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule extends PrismaClient {
  constructor(config: ConfigService) {
    super({});
  }
}
