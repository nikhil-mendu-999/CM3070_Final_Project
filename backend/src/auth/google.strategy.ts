import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ): Promise<any> {
    const { id, emails, name, displayName, photos, _json } = profile;
    const user = {
      provider: 'google',
      providerId: id,
      email: emails && emails.length > 0 ? emails[0].value : null,
      displayName: displayName || `${name?.givenName ?? ''} ${name?.familyName ?? ''}`.trim(),
      avatar: photos && photos.length > 0 ? photos[0].value : null,
      profileUrl: _json?.profile || null,
      accessToken,
    };
    done(null, user);
  }
}
