
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) return null;
    const isValid = await bcrypt.compare(pass, user.passwordHash);
    if (isValid) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { linkedAccounts: true },
    });
    if (!dbUser) throw new InternalServerErrorException('User not found for login');
    const payload = { username: dbUser.email, sub: dbUser.id };
    return {
      access_token: this.jwtService.sign(payload),
      userId: dbUser.id,
      email: dbUser.email,
      linkedAccounts: dbUser.linkedAccounts,
    };
  }

  async registerUser(signupDto: SignupDto) {
    const { email, password } = signupDto;
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('Email already in use');
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });
    return { message: "Signup successful", userId: user.id };
  }

  async validateOAuthUser(oauthData: any, provider: string) {
    let user = await this.prisma.user.findUnique({
      where: { email: oauthData.email },
      include: { linkedAccounts: true }
    });
    if (user) {
      const existingLink = await this.prisma.userLinkedAccount.findUnique({
        where: {
          provider_providerId: {
            provider,
            providerId: oauthData.providerId,
          },
        },
      });
      if (!existingLink) {
        await this.prisma.userLinkedAccount.create({
          data: {
            userId: user.id,
            provider,
            providerId: oauthData.providerId,
            displayName: oauthData.displayName,
            avatar: oauthData.avatar,
            profileUrl: oauthData.profileUrl,
          },
        });
      }
    } else {
      user = await this.prisma.user.create({
        data: {
          email: oauthData.email,
          linkedAccounts: {
            create: {
              provider,
              providerId: oauthData.providerId,
              displayName: oauthData.displayName,
              avatar: oauthData.avatar,
              profileUrl: oauthData.profileUrl,
            },
          },
        },
        include: { linkedAccounts: true },
      });
    }
    return this.prisma.user.findUnique({
      where: { email: oauthData.email },
      include: { linkedAccounts: true },
    });
  }

  
  async issueConsentGrantToken(userId: number, profileId: number, attributes: string[]) {
    // Compose payload including selected identity/profile and only allowed attributes
    // TODO: Fetch allowed attributes from user/profile, enforce privacy/visibility
    const payload = { sub: userId, profileId, attributes };
    // TODO: Issue single-use, short-lived JWT for just these claims!
    // TODO: Log audit/consent grant in DB
    return { access_token: this.jwtService.sign(payload, { expiresIn: "5m" }) };
  }
}
