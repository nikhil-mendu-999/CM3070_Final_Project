import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Roles required for route (set with a decorator, e.g., @Roles('admin'))
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const userContexts = req.user?.contexts || [];
    const isAdmin = userContexts.some(ctx => ctx.role === 'admin');
    if (requiredRoles.includes('admin') && !isAdmin) {
      throw new ForbiddenException('Admin role required');
    }
    // Add additional role logic here if needed
    return true;
  }
}
