import { Module } from '@nestjs/common';
import { ContextsService } from './contexts.service';
import { ContextsController } from './contexts.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ContextsService],
  controllers: [ContextsController],
})
export class ContextsModule {}
