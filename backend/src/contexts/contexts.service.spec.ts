import { Test, TestingModule } from '@nestjs/testing';
import { ContextsService } from './contexts.service';

describe('ContextsService', () => {
  let service: ContextsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContextsService],
    }).compile();

    service = module.get<ContextsService>(ContextsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
