import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategys/local.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategys/jwt.strategy';
import { GoogleStrategy } from './strategys/google.strategy';
import { FortyTwoStrategy } from './strategys/42.strategy';
import { TwoFactorService } from './two-factor.service';



@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule, 
    JwtModule.register({ secret: process.env.SECRET, signOptions: { expiresIn: '1w' }})
  ],
  providers: [LocalStrategy, AuthService, JwtStrategy, GoogleStrategy, FortyTwoStrategy, TwoFactorService],
  controllers: [AuthController],
})
export class AuthModule {}
