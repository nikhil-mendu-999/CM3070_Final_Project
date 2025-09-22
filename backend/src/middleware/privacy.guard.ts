import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class PrivacyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const userId = req.user?.userId;
    const data = req.body || {};
    // This logic assumes profile or field privacy checks are needed for mutations
    if (data.fieldVisibilities) {
      for (const [field, visibility] of Object.entries(data.fieldVisibilities)) {
        if (visibility === 'private' && req.body.userId !== userId) {
          throw new ForbiddenException(`Access denied for field: ${field}`);
        }
      }
    }
    // For GET requests, field masking logic is in service layer
    return true;
  }
}
