import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatsResponseDto } from './dto';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(userId: string): Promise<StatsResponseDto> {
    const totalForms = await this.prisma.form.count({
      where: { userId },
    });
    const totalActiveForms = await this.prisma.form.count({
      where: { userId, status: 'active' },
    });

    const totalSubmissions = await this.prisma.submission.count({
      where: { form: { userId } },
    });

    return {
      totalForms,
      totalActiveForms,
      totalSubmissions,
      usageLimit: 0,
    };
  }
}
