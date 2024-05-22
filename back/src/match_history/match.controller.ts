import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { MatchService } from "./match.service";
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('match')
@UseGuards(JwtAuthGuard)
export class MatchController {
    constructor (private matchService: MatchService) {}

    @Get("/history/:id")
    async getMatchHistoryByUserId(
        @Param("id") userId: number
    ) {
        userId = Number(userId);
        return await this.matchService.getMatchHistoryByUserId(userId);
    }

    @Get("/history/wins/:userId")
    async getAllWins(
        @Param("userId") userId: any
    )
    {
        return await this.matchService.getCountWinsByUserId(userId);
    }

    @Get("/history/losses/:userId")
    async getAllLosses(
        @Param("userId") userId: any
    )
    {
        return await this.matchService.getCountLossesByUserId(userId);
    }
}