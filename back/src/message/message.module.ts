import { Module } from "@nestjs/common";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { ChannelsModule } from "src/channels/channels.module";
import { ChannelsService } from "src/channels/channels.service";
import { ParticipantsService } from "src/participants/participants.service";
import { UserService } from "src/user/user.service";
import { ConversationsService } from "src/conversations/conversations.service";
import { FriendshipService } from "src/friendship/friendship.service";

@Module({
  controllers: [MessageController],
  providers: [
    MessageService,
    ChannelsService,
    ChannelsModule,
    ParticipantsService,
    UserService,
    ConversationsService,
    FriendshipService
  ],
  imports: [ChannelsModule],
})
export class MessageModule {}
