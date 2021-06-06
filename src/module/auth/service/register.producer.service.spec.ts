import { Test, TestingModule } from '@nestjs/testing';
import { RegisterProducerService } from 'src/module/auth/service/register.producer.service';

describe('RegisterProducerService', () => {
  let service: RegisterProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegisterProducerService],
    }).compile();

    service = module.get<RegisterProducerService>(RegisterProducerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
