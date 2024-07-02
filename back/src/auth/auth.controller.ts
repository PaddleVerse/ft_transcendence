import { Controller,Post, UseGuards, Request, Body, Get, Res, HttpStatus, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';
import { LocalGuard } from './guards/local.guard';
import { GoogleGuard } from './guards/google.guard';
import { FortyTwoGuard } from './guards/42.guard';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController 
{
  constructor (
      private authService: AuthService,
      ) {}

  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const user : any = await this.authService.login(req.user);
    if (user?.status === 'error') return user;
    // Set the access token as a cookie
    res.cookie('access_token', user.access_token, { httpOnly: true });

    return user;
  }

  @Post('2fa')
  // @UseGuards(JwtAuthGuard)
  async enable2FA(@Body('userId') userId: number){

    const res = await this.authService.enable2FA(userId);

    return res;
  }

  @Post('disable2fa')
  @UseGuards(JwtAuthGuard)
  async disable2FA(@Body('userId') userId: number){

    const res = await this.authService.disable2FA(userId);

    return res;
  }

  @Post('v2fa')
  // @UseGuards(JwtAuthGuard)
  async V2FA(@Body('token') token: string, @Body('userId') userId: number){

    const res = await this.authService.V2FA(userId, token);

    return res;
  }

  @Post('signup')
  async signup(@Body(new ValidationPipe()) body: CreateUserDto)
  {
    const res = await this.authService.signup(body);
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  async protectedRoute(@Request() req)
  {
    return req.user;
  }

  @UseGuards(GoogleGuard)
  @Get('google')
  async googleLogin() {
    return {
      message: 'Google login url'
    }
  }

  @UseGuards(GoogleGuard)
  @Get('google/callback')
  async googleLoginCallback(@Request() req, @Res({ passthrough: true }) res: Response) {

    const user: any = await this.authService.login(req.user);
    if (!user) return { status: 'error', message: 'User not found' };
    if (user?.twoFa)
    {
      res.cookie('access_token', user.access_token, {
        maxAge: 2592000000,
        sameSite: true,
        secure: false,
      });
      res.redirect(`http://${process.env.API_URL}/Signin`);
      res.status(HttpStatus.OK);
      return;
    }
    res.cookie('access_token', user.access_token, {
      maxAge: 2592000000,
      sameSite: true,
      secure: false,
    });
    res.redirect(`http://${process.env.API_URL}/Dashboard`);
    res.status(HttpStatus.OK);
  }


  @UseGuards(FortyTwoGuard)
  @Get('42')
  async fortyTwoLogin() {
    return {
      message: '42 login url'
    }
  }

  @UseGuards(FortyTwoGuard)
  @Get('42/callback')
  async fortyTwoLoginCallback(@Request() req, @Res({ passthrough: true }) res: Response) {

    const user: any = await this.authService.login(req.user);
    if (!user) return { status: 'error', message: 'User not found' };

    if (user?.twoFa)
    {
      res.cookie('access_token', user.access_token, {
        maxAge: 2592000000,
        sameSite: true,
        secure: false,
      });
      res.redirect(`http://${process.env.API_URL}/Signin`);
      res.status(HttpStatus.OK);
      return;
    }
    res.cookie('access_token', user.access_token, {
      maxAge: 2592000000,
      sameSite: true,
      secure: false,
    });
    res.redirect(`http://${process.env.API_URL}/Dashboard`);
    res.status(HttpStatus.OK);
  }


  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Req() req) {
    const accessToken = req.headers.authorization.split(' ')[1]; // Extracting token from Authorization header
    // this.blacklistService.addToBlacklist(accessToken);
    await this.authService.logout(accessToken);
    return { message: 'Logout successful' };
  }
}
