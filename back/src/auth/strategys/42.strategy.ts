import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy  from 'passport-42';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly userService: UserService) {
    super({
        clientID: process.env.FORTYTWO_ID,
        clientSecret: process.env.FORTYTWO_SECRET,
        callbackURL: `https://${process.env.FRONT_URL}/auth/42/callback`,
        profileFields:
        {
            id: 'id',
            nickname: 'login',
            email: 'email',
            avatar: 'image_url',
        },
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    // const { login,displayname } = profile;
    // Your logic to find or create a user
    // const user = {
    //   fortytwoId: id,
    //   // Add any other relevant user properties from the profile
    // };
    const user = await this.userService.findOrCreateFortyTwoUser(profile);
    return done(null, user);
  }
}
