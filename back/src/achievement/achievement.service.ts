import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { PrismaClient } from "@prisma/client";
import achievementsData from "./achievement.data";

@Injectable()
export class AchievementService {
  private readonly prisma: PrismaClient;
  constructor(private readonly userService: UserService) {
    this.prisma = new PrismaClient();
  }

  async AddAchievement(payload: any) {
    try {
      const user = await this.userService.getUser(payload?.user_id);
      if (!user) return;
      await this.prisma.achievement.create({
        data: {
          user_id: payload?.user_id,
          name: payload?.name,
          description: payload?.description,
          picture: payload?.picture,
        },
      });
    } catch (error) {}
  }

  async getAchievements(user_id: number) {
    try {
      return await this.prisma.achievement.findMany({
        where: {
          user_id: user_id,
        },
      });
    } catch (error) {}
  }

  async getAchievement(achievement_id: number) {
    try {
      return await this.prisma.achievement.findUnique({
        where: {
          id: achievement_id,
        },
      });
    } catch (error) {}
  }

  async deleteAchievement(achievement_id: number) {
    try {
      return await this.prisma.achievement.delete({
        where: {
          id: achievement_id,
        },
      });
    } catch (error) {}
  }


  async checkFirstGame(user_id: number) {
    const user = await this.userService.getUser(user_id);
    if (!user) return;
    const gamesPlayed = await this.prisma.game_history.count({
      where: {
        OR: [{ winner: user_id }, { loser: user_id }],
      },
    });
    if (gamesPlayed === 1) {
      await this.AddAchievement({
        user_id,
        name: achievementsData[0].title,
        description: achievementsData[0].description,
        picture: achievementsData[0].image,
      });
    }
  }

  async checkAchievements(user_id: number) {
    const user = await this.userService.getUser(user_id);
    if (!user) return;
    const wins = await this.prisma.game_history.count({
      where: {
        winner: user_id,
      },
    });
    const existingAchievements = await this.prisma.achievement.findMany({
      where: {
        user_id: user_id,
        name: {
          in: achievementsData.map((achievement) => achievement.title),
        },
      },
    });
    const existingAchievementTitles = existingAchievements.map(
      (achievement) => achievement.name
    );
    const achievementsToAdd = [];
    const milestoneWins = [1, 5, 10, 20, 50, 100];
    milestoneWins.forEach((milestone, index) => {
      if (
        wins >= milestone &&
        !existingAchievementTitles.includes(achievementsData[index + 1].title)
      ) {
        achievementsToAdd.push({
          user_id,
          name: achievementsData[index + 1].title,
          description: achievementsData[index + 1].description,
          picture: achievementsData[index + 1].image,
        });
      }
    });

    achievementsToAdd.forEach(async (achievement) => {
      await this.AddAchievement(achievement);
    });

    return achievementsToAdd;
  }
}
