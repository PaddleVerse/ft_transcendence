import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google')
{
  constructor(private readonly userService: UserService) {
    super({
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: `https://${process.env.FRONT_URL}/auth/google/callback`,
        passReqToCallback: true,
        scope: ['profile', 'email'],
    });
  }

  async validate(request: any, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const user = await this.userService.findOrCreateGoogleUser(profile);
    return done(null, user);
  }
}
