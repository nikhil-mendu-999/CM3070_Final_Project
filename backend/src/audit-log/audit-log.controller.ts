import { Controller, Get, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuditLogService } from './audit-log.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('audit-logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @ApiOperation({ summary: 'List all audit logs (admin only).' })
  @ApiResponse({ status: 200, description: 'Array of audit events.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admins only.' })
  async getLogs(@Request() req) {
    if (!req.user?.isAdmin) throw new ForbiddenException('Admin role required');
    return this.auditLogService.findAll();
  }
  @Get('me')
@ApiOperation({ summary: 'List audit logs for the current user.' })
@ApiResponse({ status: 200, description: 'User\'s own audit events.' })
async getMyLogs(@Request() req) {
  return this.auditLogService.findByUser(req.user.userId);
}

}
