import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {
  PrismaClient,
  Prisma,
  channel_participant,
  user,
  channel,
  message,
  Role,
} from "@prisma/client";

/**
 * in the chat service we will implement the logic of the entire chat application
 * in here we will implement the logic for direct messages, group chat and the logic behind it
 */
@Injectable()
export class ChatService {
  prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }





  /**
   *
   * @param userId the user filter
   * @param channelId the channel filter
   * @returns the participant with both the exact channelid and userid
   */
  async filterParticipantByIds(userId: number, channelId: number) {
    const participant = this.prisma.channel_participant.findFirst({
      where: { user_id: userId, channel_id: channelId },
    });
    return participant;
  }

  /**
   *
   * @param id
   * @returns the user with the same user id, might actually not use it
   */
  async filterParticipantbyuserId(id: number) {
    const participant = await this.prisma.channel_participant.findMany({
      where: { user_id: id },
    });
    if (!participant) throw new Error(`the user is not in any channel yet`);
    return participant;
  }

  /**
   *
   * @param id
   * @returns the channel with the same channel id
   */
  async filterParticipantbychannelId(id: number) {
    const participant = await this.prisma.channel_participant.findMany({
      where: { channel_id: id },
    });
    if (!participant) throw new Error(`the user is not in any channel yet`);
    return participant;
  }

  /**
   *
   * @param id
   * @returns removes the participant from the channel as a participant
   */
  async deleteParticipant(id: number) {
    const participant = await this.prisma.channel_participant.delete({
      where: { id: id },
    });
    return participant;
  }

  async createBannedParticipant(data: Prisma.ban_listCreateInput) {
    const user = await this.prisma.ban_list.create({ data: data });
    return user;
  }

  async updateChannel(id: number, data: Prisma.channelUpdateInput) {
    const channel = await this.prisma.channel.update({
      data: data,
      where: { id: id },
    });
    return channel;
  }
}
