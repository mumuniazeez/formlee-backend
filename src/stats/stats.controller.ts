import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtGuard } from '../auth/guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StatsResponseDto } from './dto';
import { GetUser } from '../auth/decorators/get-user.decorators';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @ApiOperation({
    summary: 'Get stats',
    description: 'Get stats for the current user',
  })
  @ApiResponse({ type: StatsResponseDto, status: 200 })
  @Get()
  getStats(@GetUser('id') userId: string) {
    return this.statsService.getStats(userId);
  }
}
