import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      adapter: new PrismaPg({
        connectionString: config.get('DATABASE_URL') as string,
      }),
      omit: { user: { passwordHash: true } },
    });
  }
}
