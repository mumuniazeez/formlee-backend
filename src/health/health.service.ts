import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly heath: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
  ) {}

  healthCheck() {
    return this.heath.check([
      async () => this.prismaHealth.pingCheck('database', this.prisma),
    ]);
  }
}
