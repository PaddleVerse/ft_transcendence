import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {

    const nickname = username;
    if (!nickname || !password || nickname.length < 3 || password.length < 6)
      return { status: 'error', message: 'Please provide all the required fields' };

    const existingUser = await this.userService.findOne(nickname);

    if (!existingUser) return { status: 'error', message: 'User not found, please signup' };

    const isPasswordValid = await this.authService.validatePassword(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) return { status: 'error', message: 'Invalid password' };

    return existingUser;
  }
}
