import { Test, TestingModule } from '@nestjs/testing';
import { ContextsController } from './contexts.controller';

describe('ContextsController', () => {
  let controller: ContextsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContextsController],
    }).compile();

    controller = module.get<ContextsController>(ContextsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
