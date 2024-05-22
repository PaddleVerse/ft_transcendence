import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { FriendshipService } from 'src/friendship/friendship.service';
import { UserService } from 'src/user/user.service';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class ConversationsService {
  prisma: PrismaClient;
  constructor(
    readonly userService: UserService,
    readonly friendService: FriendshipService
  ) {
    this.prisma = new PrismaClient();
  }

  async getConversation(user: number, friend: number) {
    const convo = await this.prisma.conversation.findFirst({
      where: {
        user_a_id: user,
        user_b_id: friend,
      },
      include: { messages: true },
    });
    if (!convo) {
      const convo2 = await this.prisma.conversation.findFirst({
        where: {
          user_b_id: user,
          user_a_id: friend,
        },
        include: { messages: true },
      });
      return convo2;
    }
    return convo;
  }

  async createConversation(user1: number, user2: number)
  {
    try {
      const user1Exists = await this.userService.getUser(
        Number(user1)
      );
      const user2Exists = await this.userService.getUser(
        Number(user2)
      );
      if (!user1Exists || !user2Exists) {
        throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
      }
      const convo = await this.getConversation(
        Number(user1),
        Number(user2)
      );
      if (convo)
        throw new HttpException(
          "Conversation already exists",
          HttpStatus.CONFLICT
        );
      const friend1 =
        await this.prisma.friendship.findFirst({
          where: {
            user_id: Number(user1),
            friendId: Number(user2),
            status: "ACCEPTED",
          },
        });
      const friend2 =
        await this.prisma.friendship.findFirst({
          where: {
            user_id: Number(user2),
            friendId: Number(user1),
            status: "ACCEPTED",
          },
        });
      if (!friend1 || !friend2)
        throw new HttpException(
          "Friendship does not exist",
          HttpStatus.NOT_FOUND
        );
      const conversation = await this.prisma.conversation.create({
        data: {
          user_a_id: Number(user1),
          user_b_id: Number(user2),
        },
        include: { messages: true },
      });
      return conversation;
    } catch (error) {
      throw error;
    }
  }

  async deleteConversation(user: number, friend: number) {
    const convo = await this.prisma.conversation.findFirst({
      where: {
        user_a_id: user,
        user_b_id: friend,
      },
    });
    if (!convo) {
      const convo2 = await this.prisma.conversation.findFirst({
        where: {
          user_b_id: user,
          user_a_id: friend,
        },
      });
      if (!convo2) {
        return null;
      }
      await this.prisma.conversation.delete({
        where: {
          id: convo2.id,
        },
      });
      return convo2;
    }
    await this.prisma.conversation.delete({
      where: {
        id: convo.id,
      },
    });
    return convo;
  }
}
