import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserDto } from './dto/user.dto';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(skip: number = 0, take: number = 25) {
    return this.prisma.user.findMany({ skip, take });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getLinkedAccounts(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { linkedAccounts: true }
    });
    if (!user) throw new NotFoundException('User not found');
    return user.linkedAccounts;
  }

  async deleteLinkedAccount(userId: number, linkedAccountId: number) {
    const acc = await this.prisma.userLinkedAccount.findUnique({ where: { id: linkedAccountId }});
    if (!acc || acc.userId !== userId) throw new ForbiddenException('Not allowed');
    const deletedAcc = await this.prisma.userLinkedAccount.delete({ where: { id: linkedAccountId } });
    // Audit log
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: "linked_account_delete",
        message: `Deleted linked account ${acc.provider}`,
        before: acc ?? undefined,
        after: undefined
      }
    });
    return deletedAcc;
  }

  async updateUser(userId: number, data: Partial<UserDto>) {
    delete data.email;
    delete (data as any).id;
    const userBefore = await this.prisma.user.findUnique({ where: { id: userId } });
    const update: any = { ...data };
    [
      'legalNameVariants', 'preferredNameVariants', 'genderVariants', 'pronounsVariants', 'fieldVisibilities'
    ].forEach(key => {
      if (update[key] && typeof update[key] === 'object') {
        update[key] = update[key];
      }
    });
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: update,
    });
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: "user_update",
        message: "Updated user identity attributes",
        before: userBefore ?? undefined,
        after: updatedUser ?? undefined
      }
    });
    return updatedUser;
  }
}
