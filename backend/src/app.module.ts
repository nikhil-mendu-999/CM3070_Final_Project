import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { AuditLogModule } from './audit-log/audit-log.module';
import { ProfilesModule } from './profiles/profiles.module';
import { UsersModule } from './users/users.module';
import { ContextsModule } from './contexts/contexts.module';
import { AuthModule } from './auth/auth.module';
// import { AuditModule } from './audit/audit.module';     // Future
// import { BulkModule } from './bulk/bulk.module';        // Future

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes env vars globally available
    }),
    ProfilesModule,
    UsersModule,
    ContextsModule,
    AuthModule,
    AuditLogModule,
    // AuditModule,       // future
    // BulkModule,        // future
  ],
  providers: [PrismaService],
})
export class AppModule {}
