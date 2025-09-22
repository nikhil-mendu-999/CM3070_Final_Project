import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()  // This makes PrismaService globally available without reimporting everywhere
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
