import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ShopService
{   
    private readonly prisma: PrismaClient;
    constructor(userService : UserService) 
    {
        this.prisma = new PrismaClient();
    }

    async getUserPadlles(userId: number)
    {
        try {
            return await this.prisma.paddle.findMany({
                where: {
                    user_id: userId
                }
            });
        }
        catch (error) {
            console.error(error);
        }
    }

    async createPaddle(body : any)
    {
        try {
            const user = await this.prisma.user.findUnique({ where: { id: body?.user_id } });
            if (!user) return 'User not found';
            if (body?.price > user.coins)
                return {status : 'error', message : 'Not enough coins'};
            await this.prisma.paddle.create({
                data: {
                    image: body?.image,
                    color: body?.color + body?.user_id,
                    user_id: body?.user_id
                }
            });
            await this.prisma.user.update({
                where: { id: body?.user_id },
                data: {
                    coins: {
                        decrement: body?.price
                    }
                }
            });
            return {status : 'success', message : 'Paddle owned'};
        }
        catch (error) {
            console.error(error);
        }
    }

    
    async enablePaddle(body : any)
    {
        try {
            if (!body) return {status : 'error', message : 'Invalid request'};

            const user = await this.prisma.user.findUnique({ where: { id: body?.user_id }, select: { paddles: true }});
            const paddels : any = user.paddles;
            const res = await paddels.find((paddle : any) => paddle.enabled === true);
            if (res && res !== undefined){
                await this.prisma.paddle.update({
                    data: { enabled: false },
                    where: { id : res.id }
                })
            }
            await this.prisma.paddle.update({
                data: { enabled: true },
                where: { color: body?.color + body?.user_id}
            })
            return {status : 'success', message : 'Paddle equipped'};
        }
        catch (error) {
            return {status : 'error', message : 'Paddle not equipped'};
        }
    }

    async disablePaddle(body : any)
    {
        try {
            if (!body) return {status : 'error', message : 'Invalid request'};
            await this.prisma.paddle.update({
                data: { enabled: false },
                where: { color: body?.color + body?.user_id}
            })
            return {status : 'success', message : 'Paddle unequipped'};
        }
        catch (error) {
            return {status : 'error', message : 'Paddle not unequipped'};
        }
    }

    async createBall(body : any)
    {
        try {
            const user = await this.prisma.user.findUnique({ where: { id: body?.user_id } });
            if (!user) return 'User not found';
            if (body?.price > user.coins)
                return {status : 'error', message : 'Not enough coins'};
            await this.prisma.ball.create({
                data: {
                    image: body?.image,
                    texture: body?.texture,
                    color: body?.color + body?.user_id,
                    user_id: body?.user_id
                }
            });
            await this.prisma.user.update({
                where: { id: body?.user_id },
                data: {
                    coins: {
                        decrement: body?.price
                    }
                }
            });
            return {status : 'success', message : 'Ball owned'};
        }
        catch (error) {
            console.error(error);
        }
    }

    async enableBall(body : any)
    {
        try {
            if (!body) return {status : 'error', message : 'Invalid request'};

            const user = await this.prisma.user.findUnique({ where: { id: body?.user_id }, select: { balls: true }});
            const balls : any = user.balls;
            const res = await balls.find((ball : any) => ball.enabled === true);
            if (res && res !== undefined){
                await this.prisma.ball.update({
                    data: { enabled: false },
                    where: { id : res.id }
                })
            }
            await this.prisma.ball.update({
                data: { enabled: true },
                where: { color: body?.color + body?.user_id}
            })
            return {status : 'success', message : 'Ball equipped'};
        }
        catch (error) {
            return {status : 'error', message : 'Ball not equipped'};
        }
    }

    async disableBall(body : any)
    {
        try {
            if (!body) return {status : 'error', message : 'Invalid request'};
            await this.prisma.ball.update({
                data: { enabled: false },
                where: { color: body?.color + body?.user_id}
            })
            return {status : 'success', message : 'Ball unequipped'};
        }
        catch (error) {
            return {status : 'error', message : 'Ball not unequipped'};
        }
    }
}