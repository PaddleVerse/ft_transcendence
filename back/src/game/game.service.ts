import { Injectable } from '@nestjs/common';
import { N_Type, PrismaClient } from '@prisma/client';

@Injectable()
export class GameService 
{
    private readonly prisma: PrismaClient
    constructor () 
    {
        this.prisma = new PrismaClient();
    }
    // this will be returning the equiped ball skin of the user by checking enabled column in the ball table of the user
    async getUserBallSkin(id: number): Promise<any>
    {
        return await this.prisma.ball.findFirst({
            where: {
                user_id: id,
                enabled: true
            }
        });

    }
    
    async getUserPadddleSkin(id: number): Promise<any>
    {
        return await this.prisma.paddle.findFirst({
            where: {
                user_id: id,
                enabled: true
            }
        });
    }
}
