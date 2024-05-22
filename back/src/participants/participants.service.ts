import { Injectable } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { ChannelsService } from "src/channels/channels.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class ParticipantsService {
  prisma: PrismaClient;
  constructor(
    readonly channelService: ChannelsService,
    readonly userService: UserService
  ) {
    this.prisma = new PrismaClient();
  }

  async createParticipant(dat: Prisma.channel_participantCreateInput) {
    const participant = await this.prisma.channel_participant.create({
      data: dat,
    });
    return participant;
  }

  async getParticipantByIds(channel: number, user: number) {
    const participant = await this.prisma.channel_participant.findFirst({
      where: {
        channel_id: channel,
        user_id: user,
      },
    });
    return participant;
  }

  async getParticipants(channel: number) {
    const participant = await this.prisma.channel_participant.findMany({
      where: {
        channel_id: channel,
      },
    });
    return participant;
  }

  async getParticipantsByChannelId(channel: number) {
    const participant = await this.prisma.channel_participant.findMany({
      where: {
        channel_id: channel,
      },
    });
    return participant;
  }

  async filterParticipationsByUID(id: number) {
    const channels = await this.prisma.channel_participant.findMany({
      where: { user_id: id },
    });
    return channels;
  }

  async updateParticipant(
    id: number,
    data: Prisma.channel_participantUpdateInput
  ) {
    const participant = await this.prisma.channel_participant.update({
      where: { id },
      data,
    });
    return participant;
  }

  async deleteParticipantFromAll(userid: number) {
    const participant = await this.prisma.channel_participant.deleteMany({
      where: { user_id: userid },
    });
    return participant;
  }

  async deleteParticipant(channel: number, user: number) {
    const participant = await this.getParticipantByIds(channel, user);
    const deleted = await this.prisma.channel_participant.delete({
      where: { id: participant.id },
    });
    return deleted;
  }
}
