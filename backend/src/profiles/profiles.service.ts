import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProfiles(requestingUserId: number, userId: number, contextId?: number) {
    const profiles = await this.prisma.profile.findMany({
      where: { userId },
      include: {
        contexts: {
          where: contextId ? { contextId } : {},
          include: { context: { include: { members: true } } },
        },
        user: true,
      },
    });
    return profiles.map(profile => {
      const contextData = contextId
        ? profile.contexts.find(c => c.contextId === contextId)
        : null;
      return {
        id: profile.id,
        userId: profile.userId,
        label: profile.label,
        displayName: profile.displayName,
        gender: profile.gender,
        sexuality: profile.sexuality,
        relationshipStatus: profile.relationshipStatus,
        profilePicture: profile.profilePicture,
        context: contextData?.context || profile.context || null,
        visibility: contextData?.visibility || profile.visibility,
        name: profile.name,
        contexts: profile.contexts,
      };
    }).filter(profile => {
      if (!contextId) {
        if (profile.userId === requestingUserId) return true;
        if (profile.visibility === 'public') return true;
        return false;
      }
      if (profile.visibility === 'public') return true;
      if (profile.visibility === 'private')
        return profile.userId === requestingUserId;
      if (profile.visibility === 'context-members' && profile.context && typeof profile.context !== 'string') {
        return Array.isArray(profile.context.members) &&
          profile.context.members.some((m: any) => m.userId === requestingUserId);
      }
      return false;
    });
  }

  async createProfile(
    userId: number,
    {
      name,
      label,
      displayName,
      gender,
      sexuality,
      relationshipStatus,
      profilePicture,
      context,
      visibility = 'private',
      contextIds = []
    }: {
      name: string;
      label?: string;
      displayName?: string;
      gender?: string;
      sexuality?: string;
      relationshipStatus?: string;
      profilePicture?: string;
      context?: string;
      visibility?: string;
      contextIds?: number[];
    }
  ) {
    const profile = await this.prisma.profile.create({
      data: {
        userId,
        name,
        label,
        displayName,
        gender,
        sexuality,
        relationshipStatus,
        profilePicture,
        context,
        visibility,
      },
      include: { contexts: true },
    });
    for (const contextId of contextIds) {
      await this.prisma.profileContext.create({
        data: {
          profileId: profile.id,
          contextId,
          visibility,
        },
      });
    }
    await this.prisma.auditLog.create({
      data: {
        userId,
        profileId: profile.id,
        action: "profile_create",
        message: `Created profile '${label || name}'`,
        after: profile ?? undefined,
      },
    });
    return profile;
  }

  async updateProfile(
    userId: number,
    profileId: number,
    body: any
  ) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      include: { contexts: true },
    });
    if (!profile || profile.userId !== userId) {
      console.error("UpdateProfile: Forbidden or missing profile", { userId, profileId });
      throw new ForbiddenException('Not allowed to edit this profile');
    }
    const beforeProfile = profile;
    const data: any = {};
    [
      'name', 'label', 'displayName', 'gender', 'sexuality',
      'relationshipStatus', 'profilePicture', 'context', 'visibility'
    ].forEach(key => {
      if (body[key] !== undefined) data[key] = body[key];
    });
    const updateResult = await this.prisma.profile.update({ where: { id: profileId }, data })
      .catch(e => {
        console.error("UpdateProfile: Error updating profile", e);
        throw new BadRequestException('Failed to update profile: ' + e.message);
      });
    if (body.contextChanges) {
      try {
        await this.prisma.profileContext.deleteMany({ where: { profileId } });
        for (const cc of body.contextChanges) {
          await this.prisma.profileContext.create({
            data: {
              profileId,
              contextId: cc.contextId,
              displayName: cc.displayName || data.displayName || profile.displayName,
              visibility: cc.visibility || data.visibility || profile.visibility,
            },
          });
        }
      } catch (e) {
        console.error('UpdateProfile: Error updating contexts', e);
        throw new BadRequestException('Failed to update contexts: ' + e.message);
      }
    }
    const updatedProfile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      include: { contexts: true },
    });
    await this.prisma.auditLog.create({
      data: {
        userId,
        profileId,
        action: "profile_update",
        before: beforeProfile ?? undefined,
        after: updatedProfile ?? undefined,
        message: `Edited profile: ${data.label || profile.label || profile.name}`,
      },
    });
    if (!updatedProfile) {
      console.error('UpdateProfile: No updated profile found after update');
      throw new BadRequestException('Update failed: no profile returned after update');
    }
    return updatedProfile;
  }

  async deleteProfile(requestingUserId: number, profileId: number) {
    const profile = await this.prisma.profile.findUnique({ where: { id: profileId } });
    if (!profile || profile.userId !== requestingUserId) {
      throw new ForbiddenException('Not allowed to delete this profile');
    }
    await this.prisma.consentGrant.deleteMany({ where: { profileId } });
    await this.prisma.profileContext.deleteMany({ where: { profileId } });
    // Optionally delete audit logs for this profile:
    // await this.prisma.auditLog.deleteMany({ where: { profileId } });
    await this.prisma.auditLog.create({
      data: {
        userId: requestingUserId,
        profileId,
        action: "profile_delete",
        before: profile ?? undefined,
        message: `Deleted profile ID ${profileId}`,
      },
    });
    await this.prisma.profile.delete({ where: { id: profileId } });
    return { success: true };
  }
}
