import { Injectable } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";

@Injectable()
export class BanService {
  prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async createBannedParticipant(data: Prisma.ban_listCreateInput) {
    const participant = await this.prisma.ban_list.create({
      data: data,
    });
    return participant;
  }

  async getChannelBanList(cid: number) {
    const list = await this.prisma.ban_list.findMany({
      where: {channel_id: cid},
    });
    return list;
  }

  async getBannedParticipantByIds(uid: number, cid: number) {
    const participant = await this.prisma.ban_list.findFirst({
      where: { user_id: uid, channel_id: cid },
    });
    return participant;
  }
}
