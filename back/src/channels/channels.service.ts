import { Injectable } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

import { MulterFile } from "multer";

import * as fs from "fs";

@Injectable()
export class ChannelsService {
  prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async createChannel(data: Prisma.channelCreateInput) {
    if (!data.name) {
      const customConfig: Config = {
        dictionaries: [adjectives, colors],
        separator: "-",
        length: 2,
      };
      const randomName: string = uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
      });
      data.name = uniqueNamesGenerator(customConfig);
    }
    const channel = await this.prisma.channel.create({
      data: data,
      include: { participants: true, messages: true, ban: true },
    });
    return channel;
  }

  async updateChannel(channelid: number, data: Prisma.channelUpdateInput) {
    const channel = await this.prisma.channel.update({
      data: data,
      where: { id: channelid },
    });
    return channel;
  }

  async getChannelById(id: number) {
    const channel = await this.prisma.channel.findUnique({
      where: { id: id },
      include: { participants: true, ban: true, messages: true },
    });

    return channel;
  }

  async getChannelByName(name: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { name: name },
      include: { participants: true, ban: true, messages: true },
    });
    return channel;
  }

  async getChannels() {
    const channels = await this.prisma.channel.findMany({
      include: { participants: true, ban: true, messages: true },
    });
    return channels;
  }

  async getChannelsWithUserId(id: number) {

    const channels = await this.prisma.channel.findMany({
      where: { participants: { none: { user_id: id } } },
      include: { participants: true, ban: true, messages: true },
    });
    return channels;
  }
  async getChannelsWithUserIdS(id: number) {

    const channels = await this.prisma.channel.findMany({
      where: { participants: { some: { user_id: id } } },
      include: { participants: true, ban: true, messages: true },
    });
    return channels;
  }


  async filterChannelsByName(name: string) {
    const channels = await this.prisma.channel.findMany({
      where: { name: name },
      include: { participants: true, ban: true, messages: true },
    });
    return channels;
  }
}
