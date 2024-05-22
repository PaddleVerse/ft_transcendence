import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { FriendshipService } from "./friendship/friendship.service";
import { FriendshipController } from "./friendship/friendship.controller";
import { FriendshipModule } from "./friendship/friendship.module";
import { ChatModule } from "./chat/chat.module";
import { ChatService } from "./chat/chat.service";
import { ChannelsService } from "./channels/channels.service";
import { ChannelsModule } from "./channels/channels.module";
import { MessageController } from "./message/message.controller";
import { MessageService } from "./message/message.service";
import { MessageModule } from "./message/message.module";
import { ParticipantsModule } from "./participants/participants.module";
import { ConversationsController } from "./conversations/conversations.controller";
import { ParticipantsController } from "./participants/participants.controller";
import { BanController } from "./ban/ban.controller";
import { ChannelsController } from "./channels/channels.controller";
import { ChatController } from "./chat/chat.controller";
import { ParticipantsService } from "./participants/participants.service";
import { BanService } from "./ban/ban.service";
import { ConversationsService } from "./conversations/conversations.service";
import { ConversationsModule } from "./conversations/conversations.module";
import { SearchService } from './search/search.service';
import { SearchController } from './search/search.controller';
import { SearchModule } from './search/search.module';
import { GatewaysModule } from './gateways/gateways.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ShopModule } from './shop/shop.module';
import { GameModule } from "./game/game.module";
import { GameController } from "./game/game.controller";
import { GameService } from "./game/game.service";
import { MatchController } from "./match_history/match.controller";
import { MatchService } from "./match_history/match.service";
import { MatchModule } from "./match_history/match.module";
import { AchievementModule } from './achievement/achievement.module';
import { AchievementService } from "./achievement/achievement.service";

@Module({
  imports: [
    AuthModule,
    UserModule,
    FriendshipModule,
    SearchModule,
    GatewaysModule,
    ChatModule,
    ChannelsModule,
    MessageModule,
    ParticipantsModule,
    ConversationsModule,
    NotificationsModule,
    ShopModule,
    GameModule,
    MatchModule,
    AchievementModule
  ],
  controllers: [
    AppController,
    FriendshipController, SearchController,
    MessageController,
    ConversationsController,
    ParticipantsController,
    BanController,
    ChannelsController,
    ChatController,
    GameController,
    MatchController
  ],
  providers: [
    AppService,
    FriendshipService, SearchService,
    ChatService,
    ChannelsService,
    MessageService,
    BanService,
    ParticipantsService,
    ConversationsService,
    GameService,
    MatchService,
    AchievementService
  ],
})
export class AppModule {}
