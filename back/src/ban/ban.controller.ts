import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import { BanService } from "./ban.service";
import { ChannelsService } from "src/channels/channels.service";
import { Prisma } from "@prisma/client";
import { channel } from "diagnostics_channel";
import { UserService } from "src/user/user.service";
import { ParticipantsService } from "src/participants/participants.service";
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller("ban")
@UseGuards(JwtAuthGuard)
export class BanController {
  constructor(
    private readonly banService: BanService,
    private readonly channelService: ChannelsService,
    private readonly userService: UserService,
    private readonly PaticipantService: ParticipantsService
  ) {}
  @Get(":cid")
  async getBanList(@Param("cid") cid: string) {
    try {
      const channel = await this.channelService.getChannelById(Number(cid));
      if (!channel) {
        throw new Error("Channel not found");
      }
      const list = await this.banService.getChannelBanList(Number(cid));
      return list;
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async banParticipant(
    @Body("cid") channel: string,
    @Body("uid") user: string
  ) {
    try {

      const us = await this.userService.getUserById(Number(user));
      if (!us) {
        throw new HttpException("User not found", 404);
      }
      const channelData = await this.channelService.getChannelById(
        Number(channel)
      );
      if (!channelData) {
        throw new HttpException("Channel not found", 404);
      }
      const participant = await this.PaticipantService.getParticipantByIds(
        Number(channel),
        Number(user)
      );
      if (!participant) {
        throw new HttpException("Participant not found", 404);
      }
      if (channelData.ban.filter((ban) => ban.id === Number(user)).length > 0) {
        throw new HttpException("User already banned", 400);
      }
      const banned = await this.banService.createBannedParticipant({
        channel: { connect: { id: Number(channel) } },
        user: { connect: { id: Number(user) } },
      });
      const deleted = await this.PaticipantService.deleteParticipant(
        channelData.id,
        participant.user_id
      );
      return banned;
    } catch (error) {
      throw error;
    }
  }
}
