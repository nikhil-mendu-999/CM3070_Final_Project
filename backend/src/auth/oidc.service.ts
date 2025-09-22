import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OidcService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async listSharableIdentities(userId: number) {
  return this.prisma.profile.findMany({
    where: { userId },
    select: {
      id: true,
    name: true,
    label: true,
    displayName: true,
    gender: true,
    sexuality: true,
    relationshipStatus: true,
    profilePicture: true,
    context: true,
    visibility: true,
    },
  });
}


  async createConsentGrant(userId: number, body: any) {
  const profile = await this.prisma.profile.findUnique({
    where: { id: body.profileId, userId },
    select: { id: true, name: true }
  });
  if (!profile) throw new NotFoundException('Profile not found or does not belong to user');
  const payload = {
    sub: userId,
    profileId: profile.id,
    attrs: Array.isArray(body.attributes) ? body.attributes : [],
    clientId: body.clientId,
    scope: body.scope || "",
  };
  const token = this.jwtService.sign(payload, { expiresIn: "5m" });
  await this.prisma.consentGrant.create({
    data: {
      userId,
      profileId: profile.id,
      clientId: body.clientId,
      scope: body.scope || "",
      issuedAt: new Date(), // Prisma creates as default, but explicit is safest
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      token,
      grantedAttrs: Array.isArray(body.attributes) ? body.attributes : [],
    }
  });
  return { token };
}

async listMyConsentGrants(userId: number) {
  return this.prisma.consentGrant.findMany({
    where: { userId },
    include: { profile: true }
  });
}


  async revokeConsentGrant(grantId: number, userId: number) {
    const grant = await this.prisma.consentGrant.findUnique({ where: { id: grantId } });
    if (!grant || grant.userId !== userId) throw new NotFoundException("Cannot revoke");
    await this.prisma.consentGrant.update({
      where: { id: grantId },
      data: { revoked: true }
    });
  }
}
