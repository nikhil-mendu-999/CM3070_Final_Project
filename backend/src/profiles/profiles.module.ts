import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { PrismaModule } from '../prisma.module'; // We will create this below

@Module({
  imports: [PrismaModule],          // Import PrismaModule to inject PrismaService
  providers: [ProfilesService],     // Provide ProfilesService here
  controllers: [ProfilesController],// Register controller
})
export class ProfilesModule {}
