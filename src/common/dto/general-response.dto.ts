import { ApiProperty } from '@nestjs/swagger';

export class GeneralOkResponseDto {
  @ApiProperty({
    description: 'Human readable message',

    examples: ['Item deleted successfully', 'Item created successfully'],
  })
  message!: string;
}
