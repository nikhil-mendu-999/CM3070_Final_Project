import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { ProfilesModule } from './profiles/profiles.module';
import { UsersModule } from './users/users.module';
import { ContextsModule } from './contexts/contexts.module';
import { AuthModule } from './auth/auth.module';  // Import AuthModule here

@Module({
  imports: [
    PrismaModule,
    ProfilesModule,
    UsersModule,
    ContextsModule,
    AuthModule,    // Add AuthModule
  ],
})
export class AppModule {}
