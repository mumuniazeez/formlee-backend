import { ApiProperty } from '@nestjs/swagger';

export class StatsResponseDto {
  @ApiProperty({ description: 'Total number of forms' })
  totalForms!: number;
  @ApiProperty({ description: 'Total number of active forms' })
  totalActiveForms!: number;
  @ApiProperty({ description: 'Total number of submissions' })
  totalSubmissions!: number;
  @ApiProperty({ description: 'Usage limit for this month' })
  usageLimit!: number;
}
