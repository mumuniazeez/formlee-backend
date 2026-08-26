import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthCheck } from '@nestjs/terminus';
import { ApiOperation } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiOperation({
    summary: 'Check server health',
    description: 'Check if server is up and running',
  })
  @Get()
  @HealthCheck()
  healthCheck() {
    return this.healthService.healthCheck();
  }
}
