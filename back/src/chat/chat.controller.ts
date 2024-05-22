import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  UseGuards
} from "@nestjs/common";
import { ChatService } from "./chat.service";

import { UserService } from "src/user/user.service";
import { FriendshipService } from "src/friendship/friendship.service";
import { ChannelsService } from "../channels/channels.service";
import { ConversationsService } from "src/conversations/conversations.service";
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller("chat")
@UseGuards(JwtAuthGuard)
export class ChatController {
  /**
   *
   * @param chatService
   * @description this constructor will init all the dependencies that we need to use in the chatController
   */
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly friendShipService: FriendshipService,
    private readonly channelService: ChannelsService,
    // private readonly messageService: MessageService,
    private readonly conversationService: ConversationsService
  ) {}

  @Get("chatlist/:id")
  async getChatList(@Param("id") id: string) {
    try {
      const channelList = await this.chatService.filterParticipantbyuserId(+id);
      const user1 = await this.userService.getUserById(+id);
      if (!user1) {
        throw new HttpException("no records found", HttpStatus.BAD_REQUEST);
      }
      const friendsList = await this.friendShipService.getFriends(+id);
      let channels = [];
      let friends = [];
      for (const value of channelList) {
        const ch = await this.channelService.getChannelById(value.channel_id);
        if (ch) {
          const cha = { ...ch, user: false };
          channels.push(cha);
        }
      }
      for (const friend of friendsList) {
        const user = await this.userService.getUserById(friend.friendId);
        const conversations = await this.conversationService.getConversation(
          Number(id),
          user.id
        );
        if (conversations) {
          const u = { ...user, user: true, conversations: conversations };
          friends.push(u);
        }
      }
      const list = channels.concat(friends);
      list.sort((a, b) => {
        const messageA = a.user
          ? a.conversations.messages[a.conversations.messages.length - 1]
          : a.messages[a.messages.length - 1];
        const messageB = b.user
          ? b.conversations.messages[b.conversations.messages.length - 1]
          : b.messages[b.messages.length - 1];
        if (!messageA && messageB) {
          return 1;
        }
        if (messageA && !messageB) {
          return -1;
        }
        return messageB?.createdAt.getTime() - messageA?.createdAt.getTime();
      });
      return list;
    } catch (error) {
      throw new HttpException("no records found", HttpStatus.BAD_REQUEST);
    }
  }
}
