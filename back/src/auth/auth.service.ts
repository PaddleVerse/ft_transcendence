import { ConflictException, ForbiddenException, Injectable,UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { TwoFactorService } from './two-factor.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';

@Injectable()
export class AuthService 
{
    private readonly prisma : PrismaClient;
    constructor (private jwtService: JwtService, private userService: UserService, private twoFactorService: TwoFactorService) 
    {
        this.prisma = new PrismaClient();
    }
   
    async signup(body: CreateUserDto)
    {
        try {
            const { nickname, password, name, middlename } : CreateUserDto = body;
            if (!nickname || !password || !name || !middlename)
                return { status: 'error', message: 'Please provide all the required fields' };
            
            const user = await this.prisma.user.findUnique({
                where : {
                    nickname
                }
            });
    
            if (user) return { status: 'error_', message: 'User already exists' };
    
            await this.prisma.user.create({
                data : {
                    nickname,
                    name,
                    middlename,
                    password: await this.hashPassword(password)
                }
            });
            
            return { status: 'success', message: 'User created' };
        } catch (error) {
            return { status: 'error', message: 'An error occurred' };
        }
    }
    
    async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> 
    {
      return await bcrypt.compare(plainPassword, hashedPassword);
    }
    
    async hashPassword(password: string): Promise<string> {
      return await bcrypt.hash(password, 10);
    }

    async login(user: any)
    {
        if (user?.status === 'error') return user;
        const payload = { nickname: user.nickname, sub: user.id };
        const user_ = await this.userService.getUser(user.id);
        return {
            twoFa : user_.twoFa,
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async enable2FA(userId: number): Promise<any>
    {
        const user = await this.userService.getUser(userId);

        if (!user) throw new UnauthorizedException('User not found');

        const url = await this.twoFactorService.generateSecret(user.nickname);

        await this.userService.updateUser(userId, { twoFaSecret: url.secret });

        const qrCode = await this.twoFactorService.generateQRCode(url.url);

        return { Qr: qrCode };
    }

    async disable2FA(userId: number): Promise<any>
    {
        const user = await this.userService.getUser(userId);

        if (!user) throw new UnauthorizedException('User not found');

        await this.userService.updateUser(userId, { twoFaSecret: null , twoFa: false});

        return { message: '2FA disabled' };
    }

    async V2FA(userId: number, token: string): Promise<any>
    {
        const user = await this.userService.getUser(userId);

        if (!user) throw new UnauthorizedException('User not found');

        const res = await this.twoFactorService.verifyToken(user.twoFaSecret, token);

        if (!res) return {ok: false};

        this.userService.updateUser(userId, { twoFa: res });

        return {ok: res};
    }

    async logout (token : string)
    {
       try {
         await this.prisma.blacklistedTokens.create({
             data : {
                 token
             }
         });
       } catch (error) {
            console.error(error);
       }
    }
};

