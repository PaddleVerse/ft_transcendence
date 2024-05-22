import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from "@nestjs/common";
import { ParticipantsService } from "./participants.service";
import { Prisma, Role, channel, user } from "@prisma/client";
import { BanService } from "src/ban/ban.service";
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import * as bcrypt from 'bcrypt';


@Controller("participants")
@UseGuards(JwtAuthGuard)
export class ParticipantsController {
  constructor(
    private readonly participantsService: ParticipantsService,
    private readonly banService: BanService
  ) {}

  @Post()
  async createParticipants(
    @Body("participants") part: Prisma.channel_participantCreateInput,
    @Body("user") user: user,
    @Body("channel") channel: string
  ) {
    try {
      const ch = await this.participantsService.channelService.getChannelById(
        Number(channel)
      );
      if (!ch)
        throw new HttpException("no such channel", HttpStatus.BAD_REQUEST);
      const us = await this.participantsService.userService.getUserById(
        +user.id
      );
      if (!us) throw new HttpException("no such user", HttpStatus.BAD_REQUEST);
      const pa = await this.participantsService.getParticipantByIds(
        ch.id,
        us.id
      );
      if (pa)
        throw new HttpException("user already in channel", HttpStatus.CONFLICT);
      // added banned from channel
      const banlist = await this.banService.getChannelBanList(ch.id);
      const banned = banlist.find((b) => b.user_id === us.id);
      if (banned) {
        throw new HttpException(
          "you are banned from this channel",
          HttpStatus.FORBIDDEN
        );
      }
      if (ch.key && await (bcrypt.compare(ch.key, ch.key))) {
        throw new HttpException("wrong key", HttpStatus.BAD_REQUEST);
      }
      const participant = await this.participantsService.createParticipant({
        ...part,
        channel: { connect: { id: ch.id } },
        user: { connect: { id: us.id } },
      });
      return participant;
    } catch (error) {
      throw error;
    }
  }

  @Get(":id")
  async getPaticipatedChannels(@Param("id") id: string) {
    try {
      const user = await this.participantsService.userService.getUserById(
        Number(id)
      );
      if (!user) {
        throw new HttpException("no such user", HttpStatus.BAD_REQUEST);
      }
      const channels = await this.participantsService.filterParticipationsByUID(
        user.id
      );
      return channels;
    } catch (error) {
      throw error;
    }
  }

  @Put(":id")
  async updatePaticipant(
    @Param("id") id: string,
    @Body("channel") channelId: string,
    @Body("executor") execId: string,
    @Body("participant") update: Prisma.channel_participantUpdateInput
  ) {
    try {
      const u = await this.participantsService.userService.getUserById(
        Number(id)
      );
      if (!u) throw new HttpException("no such user", HttpStatus.BAD_REQUEST);
      const ch = await this.participantsService.channelService.getChannelById(
        Number(channelId)
      );
      if (!ch)
        throw new HttpException("no such channel", HttpStatus.BAD_REQUEST);
      const admin = await this.participantsService.getParticipantByIds(
        ch.id,
        Number(execId)
      );
      if (!admin || admin.role === Role.MEMBER) {
        throw new HttpException(
          "you are not an admin to this channel",
          HttpStatus.BAD_REQUEST
        );
      }
      const participant = await this.participantsService.getParticipantByIds(
        ch.id,
        u.id
      );
      if (!participant)
        throw new HttpException("no such participant", HttpStatus.BAD_REQUEST);
      if (participant.id === admin.id) {
        throw new HttpException("can't modify self", HttpStatus.BAD_REQUEST);
      }
      if (participant.role === "ADMIN") {
        throw new HttpException(
          "you can't change on an admin",
          HttpStatus.BAD_REQUEST
        );
      }
      const updated = await this.participantsService.updateParticipant(
        participant.id,
        update
      );
      return updated;
    } catch (error) {
      throw error;
    }
  }

  @Delete("leave")
  async deletePaticipant(
    @Query("channel") channel: string,
    @Query("user") user: string
  ) {
    try {
      const ch = await this.participantsService.channelService.getChannelById(
        Number(channel)
      );
      const us = await this.participantsService.userService.getUserById(
        Number(user)
      );
      if (!ch)
        throw new HttpException("no such channel", HttpStatus.BAD_REQUEST);
      if (!us) throw new HttpException("no such user", HttpStatus.BAD_REQUEST);
      const participant = await this.participantsService.getParticipantByIds(
        ch.id,
        us.id
      );
      if (!participant)
        throw new HttpException("no such participant", HttpStatus.BAD_REQUEST);
      const participants = await this.participantsService.getParticipants(
        ch.id
      );
      if (participants.length === 1) {
        const deleted =
          await this.participantsService.prisma.channel_participant.delete({
            where: { id: participant.id },
          });
        const deletedChannel =
          await this.participantsService.prisma.channel.delete({
            where: { id: ch.id },
          });
        return deleted;
      }
      if (participants.length > 1) {
        participants[1].role = Role.ADMIN;
        const updated = await this.participantsService.updateParticipant(
          participants[1].id,
          participants[1]
        ) 
      }
      const deleted =
        await this.participantsService.prisma.channel_participant.delete({
          where: { id: participant.id },
        });

      return deleted;
    } catch (error) {
      throw error;
    }
  }

  @Delete("kick")
  async kickPaticipant(
    @Query("channel") channel: string,
    @Query("user") user: string,
    @Query("target") target: string
  ) {
    try {
      const ch = await this.participantsService.channelService.getChannelById(
        Number(channel)
      );
      if (!ch)
        throw new HttpException("no such channel", HttpStatus.BAD_REQUEST);
      const us = await this.participantsService.userService.getUserById(
        Number(user)
      );
      if (!us) throw new HttpException("no such user", HttpStatus.BAD_REQUEST);
      const ta = await this.participantsService.userService.getUserById(
        Number(target)
      );
      if (!ta) throw new HttpException("no such user", HttpStatus.BAD_REQUEST);
      const participant = await this.participantsService.getParticipantByIds(
        ch.id,
        us.id
      );
      if (!participant)
        throw new HttpException("no such participant", HttpStatus.BAD_REQUEST);
      const taParticipant = await this.participantsService.getParticipantByIds(
        ch.id,
        ta.id
      );
      if (!taParticipant)
        throw new HttpException("no such participant", HttpStatus.BAD_REQUEST);
      if (taParticipant.role === Role.ADMIN) {
        throw new HttpException("can't kick an admin", HttpStatus.BAD_REQUEST);
      }
      if (participant.role === Role.MEMBER) {
        throw new HttpException(
          "you are not an admin/mod",
          HttpStatus.BAD_REQUEST
        );
      }
      // if (participant.role === Role.ADMIN) {
      //   const members = await this.participantsService.getParticipants(ch.id);
      //   // if (members.length === 1) { // the case where there is only one person in the channel
      //   //   const deleted = await this.participantsService.prisma.channel_participant.delete({
      //   //     where: { id: participant.id },
      //   //   });
      //   //   return deletedChannel;
      //   // }
      //   if (members.length > 1) {
      //     members[1].role = Role.ADMIN;
      //     const updated = await this.participantsService.updateParticipant(
      //       members[1].id,
      //       members[1]
      //     );
      //   }
      // }
      const deleted =
        await this.participantsService.prisma.channel_participant.delete({
          where: { id: taParticipant.id },
        });
      return deleted;
    } catch (error) {
      throw error;
    }
  }
}
