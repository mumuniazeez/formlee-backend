import { Test, TestingModule } from '@nestjs/testing';
import { PolarService } from './polar.service';

describe('PolarService', () => {
  let service: PolarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PolarService],
    }).compile();

    service = module.get<PolarService>(PolarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
