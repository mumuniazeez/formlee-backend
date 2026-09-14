import { Controller } from '@nestjs/common';
import { PolarService } from './polar.service';

@Controller('polar')
export class PolarController {
  constructor(private readonly polarService: PolarService) {}
}
