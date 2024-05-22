import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { ChannelsService } from 'src/channels/channels.service';
import { UserService } from 'src/user/user.service';
import { BanModule } from 'src/ban/ban.module';
import { BanService } from 'src/ban/ban.service';

@Module({
  providers: [ParticipantsService, ChannelsService, UserService, BanService],
  controllers: [ParticipantsController],
})
export class ParticipantsModule {}
