import { Injectable } from "@nestjs/common";
import { Prisma, PrismaClient, message } from "@prisma/client";

@Injectable()
export class MatchService {
  prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }
  
  async getMatchHistoryByUserId(userId: number) {
    return await this.prisma.game_history.findMany({
      where: {
        OR: [
          { winner: userId },
          { loser: userId }
        ]
      },
      orderBy: {
        start_time: 'desc' // Order by createdAt field in descending order
      }
    });
  }
  
  async getCountWinsByUserId(userId: any) 
  {
    try {
      return await this.prisma.game_history.count({
        where: {
          winner: +userId
        }
      });
    } catch (error) {}
  }

  async getCountLossesByUserId(userId: any) 
  {
    try {
      return await this.prisma.game_history.count({
        where: {
          loser: +userId
        }
      });
    } catch (error) {}
  }
}