import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID')!,
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET')!,
      callbackURL: 'http://localhost:3000/auth/github/callback',
      scope: ['user:email'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    const { id, emails, displayName, username, photos, profileUrl } = profile;
    const user = {
      provider: 'github',
      providerId: id,
      email: emails && emails.length > 0 ? emails[0].value : null,
      displayName: displayName || username || '',
      avatar: photos && photos.length > 0 ? photos[0].value : null,
      profileUrl: profileUrl || null,
      accessToken,
    };
    done(null, user);
  }
}
