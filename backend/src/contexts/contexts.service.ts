import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ContextsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(skip: number = 0, take: number = 25) {
    return this.prisma.context.findMany({ skip, take });
  }

  findOne(id: number) {
    return this.prisma.context.findUnique({ where: { id } });
  }

  async listMembers(contextId: number) {
    return this.prisma.userContext.findMany({
      where: { contextId },
      include: { user: { select: { id: true, email: true } } },
    });
  }

  async setMemberRole(
    contextId: number,
    targetUserId: number,
    requestingUserId: number,
    role: string
  ) {
    const reqer = await this.prisma.userContext.findUnique({
      where: { userId_contextId: { userId: requestingUserId, contextId } },
    });
    if (!reqer || reqer.role !== "admin") throw new ForbiddenException('Only admins may change roles.');
    if (requestingUserId === targetUserId) throw new ForbiddenException('Cannot demote yourself.');
    const before = await this.prisma.userContext.findUnique({ where: { userId_contextId: { userId: targetUserId, contextId } } });
    await this.prisma.userContext.update({
      where: { userId_contextId: { userId: targetUserId, contextId } },
      data: { role },
    });
    // Audit log
    await this.prisma.auditLog.create({
      data: {
        userId: requestingUserId,
        contextId,
        action: "role_change",
        target: `userId:${targetUserId}`,
        before: before ?? undefined,
        after: { ...(before ?? {}), role },
        message: `Set member ${targetUserId} role to ${role}`
      }
    });
    return { success: true };
  }

  async createContext(name: string, ownerId: number) {
    const context = await this.prisma.context.create({ data: { name } });
    await this.prisma.userContext.create({ data: { contextId: context.id, userId: ownerId, role: "admin" } });
    await this.prisma.auditLog.create({
      data: {
        userId: ownerId,
        contextId: context.id,
        action: "context_create",
        message: `Created context '${name}'`
      }
    });
    return context;
  }

  async findUserContexts(userId: number) {
    const memberships = await this.prisma.userContext.findMany({ where: { userId }, include: { context: true } });
    return memberships.map(m => m.context);
  }

  async exportUserData(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profiles: { include: { contexts: true } }, contexts: true }
    });
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: "gdpr_export",
        message: "User exported account data"
      }
    });
    return { user };
  }

  async deleteUserAccount(userId: number) {
    await this.prisma.profileContext.deleteMany({ where: { profile: { userId } } });
    await this.prisma.profile.deleteMany({ where: { userId } });
    await this.prisma.userContext.deleteMany({ where: { userId } });
    const before = await this.prisma.user.findUnique({ where: { id: userId } });
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: "account_delete",
        before: before ?? undefined,
        message: "User deleted (GDPR)"
      }
    });
    await this.prisma.user.update({
      where: { id: userId },
      data: { email: `deleted_user_${userId}@anonymized.local`, passwordHash: '' }
    });
    return { success: true };
  }

  addMember(contextId: number, userId: number) {
    return this.prisma.userContext.create({ data: { contextId, userId } });
  }

  removeMember(contextId: number, userId: number) {
    return this.prisma.userContext.deleteMany({ where: { contextId, userId } });
  }

  async updateContext(id: number, name: string, requestingUserId: number) {
    const context = await this.prisma.context.findUnique({ where: { id }, include: { members: true } });
    if (!context) throw new BadRequestException('Context not found');
    if (!context.members.some(m => m.userId === requestingUserId))
      throw new ForbiddenException('Not allowed to edit this context');
    const before = await this.prisma.context.findUnique({ where: { id } });
    const updated = await this.prisma.context.update({ where: { id }, data: { name } });
    await this.prisma.auditLog.create({
      data: {
        userId: requestingUserId,
        contextId: id,
        action: "context_rename",
        before: before ?? undefined,
        after: updated ?? undefined,
        message: `Renamed context from '${before?.name ?? ""}' to '${name}'`
      }
    });
    return updated;
  }

  async deleteContext(id: number, requestingUserId: number) {
    const context = await this.prisma.context.findUnique({ where: { id }, include: { members: true } });
    if (!context) throw new BadRequestException('Context not found');
    if (!context.members.some(m => m.userId === requestingUserId))
      throw new ForbiddenException('Not allowed to delete this context');
    await this.prisma.userContext.deleteMany({ where: { contextId: id } });
    await this.prisma.profileContext.deleteMany({ where: { contextId: id } });
    await this.prisma.auditLog.create({
      data: {
        userId: requestingUserId,
        contextId: id,
        action: "context_delete",
        before: context ?? undefined,
        message: "Context deleted"
        }
    });
    await this.prisma.context.delete({ where: { id } });
    return { success: true };
  }
}
