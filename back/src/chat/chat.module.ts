import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { UserService } from "src/user/user.service";
import { UserModule } from "src/user/user.module";
import { FriendshipService } from "src/friendship/friendship.service";
import { FriendshipModule } from "src/friendship/friendship.module";
import { MessageModule } from "../message/message.module";
import { ChannelsService } from "../channels/channels.service";
import { MessageService } from "../message/message.service";
import { ConversationsService } from "src/conversations/conversations.service";

@Module({
  providers: [
    ChatService,
    UserService,
    FriendshipService,
    ChannelsService,
    MessageService,
    ConversationsService,
  ],
  controllers: [
    ChatController,
  ],
  imports: [UserModule, FriendshipModule, ChatModule, MessageModule],
})
export class ChatModule {}
