import { Controller, UseGuards, Delete, Get, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('game')
@UseGuards(JwtAuthGuard)
export class GameController 
{
    constructor (private readonly notService:GameService) {}

    @Get('getUserBallSkin/:id')
    async getUserBallSkin(@Param('id') id: number)
    {
        id = parseInt(id.toString());
        return await this.notService.getUserBallSkin(id);
    }

    @Get('getUserPaddleSkin/:id')
    async getUserPadddleSkin(@Param('id') id: number)
    {
        id = parseInt(id.toString());
        return await this.notService.getUserPadddleSkin(id);
    }
}
