import { Module } from '@nestjs/common';
import { BanService } from './ban.service';
import { BanController } from './ban.controller';
import { ChannelsService } from 'src/channels/channels.service';

@Module({
  providers: [BanService, ChannelsService],
  controllers: [BanController]
})
export class BanModule {}
