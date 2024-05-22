import { Body } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { FriendshipService } from "src/friendship/friendship.service";
import { UserService } from "../user/user.service";
import { PrismaClient, user, Status } from "@prisma/client";
import { GatewaysService } from "./gateways.service";
import { ConversationsService } from "src/conversations/conversations.service";
import { NotificationsService } from "src/notifications/notifications.service";
import { AchievementService } from "src/achievement/achievement.service";
import GameRoom from "src/game/objects/GameRoom";
import Player from "src/game/objects/Player";

type userT = {
  id: number;
  nickname: string;
  socketId: string;
};

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export default class GameGateway {
  private readonly prisma: PrismaClient;
  private rooms: {
    [key: string]: GameRoom;
  } = {};
  private mainLoopId: NodeJS.Timer;

  constructor(
    private readonly friendshipService: FriendshipService,
    private readonly userService: UserService,
    private readonly convService: ConversationsService,
    private readonly gatewayService: GatewaysService,
    private readonly notificationService: NotificationsService,
    private readonly achievementService: AchievementService
  ) {
    this.prisma = new PrismaClient();
    this.mainLoop();
  }
  @WebSocketServer() server: Server;

  async handleConnection(client: any) {}

  async handleDisconnect(client: any) {
    const socketId = client.id;
    // Find the user ID based on the disconnecting socket ID
    const userId = Object.keys(this.userService.clients).find(
      (key) => this.userService.clients[key].socketId === socketId
    );
    if (userId) {
      const user = await this.userService.getUserById(+userId);
      if (user) {
        // Update the user's status to offline
        await this.userService.updateUser(user.id, { status: Status.OFFLINE });
        this.server.to(this.getSocketId(user.id)).emit("refresh");

      }
    } else {
      console.error(`Failed to find a matching user for socket ID ${socketId}`);
    }

  }
  // Helper method to notify the remaining player
  private notifyRemainingPlayer(room: string, remainingRole: string) {

  }
  // game logic
  @SubscribeMessage("joinGame")
  async handleJoinGame(
    @ConnectedSocket() client: any,
    @MessageBody() data: { senderId: number; room: string }
  ): Promise<void> {
    // Join the client to the specified room
    client.join(data?.room);

    // locate the room if it exists
    if (this.rooms[data?.room]) {
      this.rooms[data?.room].addPlayer(
        client.id,
        this.server,
        client,
        data?.senderId
      );
    } else {
      let room = new GameRoom(data?.room, this.server);
      this.rooms[data?.room] = room;
      room?.addPlayer(client.id, this.server, client, data?.senderId);
    }
    const userId = await client.handshake.query?.userId;
    this.userService.clients[userId] = { socketId: client.id, socket: client };
    const user = await this.userService.getUserById(+userId);
    if (user) {
      await this.userService.updateUser(user.id, { status: Status.IN_GAME });
      this.server.to(this.getSocketId(user.id)).emit("refresh");

    }
  }

  @SubscribeMessage("movePaddleGame")
  async handleMovePaddleGame(client: any, payload: any): Promise<string> {
    if (!this.rooms[payload?.room]) return;
    const game = this.rooms[payload?.room].game;
    if (!game) return;
    game.movePaddle(client.id, payload);
    client.broadcast.to(payload?.room).emit("paddlePositionUpdate", payload);
    return "Yep";
  }
  
  mainLoop() {
    this.mainLoopId = setInterval(async () => {
      for (const room in this.rooms) {
        if (!this.rooms[room]) continue;
        if (this.rooms[room].game) {
          const gameRoom = this.rooms[room];
          const game = this.rooms[room].getGame();
          game.update();
          this.server.to(room).emit("moveBall", game.ball);
          if (game.isGameOver()) {
            this.addGameHistory(this.rooms[room]);
            this.rooms[room].dataSaved = true;
          }
        }
      }
    }, 1000 / 60);
  }

  addGameHistory = async (room: GameRoom) => {
    if (room?.dataSaved) return;
    const game = room?.game;
    await this.prisma.$connect();
    const winner: Player = game.winner;
    const loser: Player = game.players.find((p) => p.id !== winner.id);
    const winnerId = winner.userid;
    const loserId = loser.userid;
    const winnerScore = game.score[winner.id];
    const loserScore = game.score[loser.id];
    // coins to add depending on the diffrence in score
    const coinsToAdd = Math.abs(winnerScore - loserScore) * 100;
    try {
      const data = {
        winner: winnerId,
        loser: loserId,
        winner_score: winnerScore,
        loser_score: loserScore,
        start_time: room?.startDate,
        end_time: new Date(),
      };

      const createResult = await this.prisma.game_history.create({
        data,
      });
      // increment the win_streak of the winner and put the result in the game history
      const user = await this.prisma.user.update({
        where: { id: winnerId },
        data: {
          win_streak: {
            increment: 1,
          },
        },
      });

      await this.prisma.game_history.update({
        where: { id: createResult.id },
        data: {
          winner: winnerId,
          loser: loserId,
          winner_score: winnerScore,
          loser_score: loserScore,
          winner_streak: user.win_streak,
        },
      });
      // reset the win streak of the loser
      await this.prisma.user.update({
        where: { id: loserId },
        data: {
          win_streak: 0,
        },
      });

      // add xp to the winner that changes due to the diffrence in score
      await this.prisma.user.update({
        where: { id: winnerId },
        data: {
          xp: {
            increment: Math.abs(winnerScore - loserScore) * 10,
          },
        },
      });

      const winnerUser = await this.userService.getUserById(winnerId);
      const loserUser = await this.userService.getUserById(loserId);
      await this.userService.addCoins(winnerUser.id, coinsToAdd);
    } catch (error) {
      console.error("Failed to create game history:", error);
    }
    this.achievementService.checkFirstGame(winnerId);
    this.achievementService.checkFirstGame(loserId);
    this.achievementService.checkAchievements(winnerId);
    await this.userService.updateUser(winnerId, { status: Status.ONLINE });
    this.server.to(this.getSocketId(winnerId)).emit("refresh");
    await this.userService.updateUser(loserId, { status: Status.ONLINE });
    this.server.to(this.getSocketId(loserId)).emit("refresh");
    this.server
      .to(room?.id)
      .emit("gameOver", { winner: winner.id, loser: loser.id });
    delete this.rooms[room?.id];
  };

  @SubscribeMessage("matchMaking")
  async MatchMakingHandler(client: any, payload: any) {
    const user = await this.userService.getUserById(payload?.id);
    if (!user) return;
    if (user?.status === Status.IN_GAME) {
      this.server.to(this.getSocketId(user.id)).emit("alreadyInGame");
      return;
    }
    const usr: userT = {
      id: user.id,
      nickname: user.nickname,
      socketId: this.getSocketId(user.id),
    };
    const room = await this.gatewayService.matchmaking(usr);
    if (room) {
      const matchQueue = this.gatewayService.matchQueue;

      const values = Array.from(matchQueue.values());
      values.forEach((value, index) => {
        const otherUserId = values[index === 0 ? 1 : 0].id;
        this.userService.updateUser(value.id, { status: Status.IN_GAME });
        this.server.to(value.socketId).emit("okk", {
          id: otherUserId,
          room: room,
        });
        this.server.to(value.socketId).emit("start", {
          id: otherUserId,
          room: room,
        });
      });
      this.gatewayService.matchQueue.clear();
    }
  }

  @SubscribeMessage("cancelMatchMaking")
  CancelMatchMaking(client: any, payload: any) {
    this.gatewayService.matchQueue.clear();
    const rooms : any = this.gatewayService.rooms;
    let resRoom = null;
    if (rooms) {
      for (const room of rooms) {
        if (room?.users.has(payload?.id)) {
          resRoom = room;
          break;
        }
      }
      if (resRoom) {
        for (const user of resRoom.users) {
          this.server.to(user[1].socketId).emit("leftRoom");
          this.userService.updateUser(user[1].id, { status: Status.ONLINE });
        }
        this.gatewayService.deleteRoom(resRoom.name);
      }
    }
  }

  @SubscribeMessage("leftRoom")
  async leaveRoomHandler(client: any, payload: any) {
    const room = this.rooms[payload.room];
    if (!room) return;

    for (const player of room.players) {

      // check who wins
      this.server.to(player.userid + "").emit("leftRoom");
      this.server.to(player.userid + "").emit("refresh");
      await this.userService.updateUser(player.userid, { status: Status.ONLINE });
    }

    delete this.rooms[payload.room];
    const user = await this.userService.getUserById(payload.id);
    if (!user) return;
    const usr: userT = {
      id: user.id,
      nickname: user.nickname,
      socketId: this.getSocketId(user.id),
    };
    await this.gatewayService.leaveRoom(usr);
  }

  getSocketId(userId: number): string {
    return this.userService.clients[userId] === undefined
      ? null
      : this.userService.clients[userId].socketId;
  }

  @SubscribeMessage("gameInvite")
  async gameInvite(
    @ConnectedSocket() socket: Socket,
    @Body("sender") sender: user,
    @Body("receiver") receiver: user
  ) {
    if (!sender || !receiver) return;
    const senderSocketId = this.userService.clients[sender.id].socketId;
    const receiverSocketId = this.userService.clients[receiver.id].socketId;
    const receiverUser = await this.userService.getUserById(receiver.id);
    if (!receiverUser) return;
    if (receiverUser.status === Status.IN_GAME) {
      this.server.to(senderSocketId).emit("userInGame");
      return;
    }
    const roomId = sender.name + receiver.name + Date.now();
    this.server.to(receiverSocketId).emit("acceptedGameInvite", {
      sender: sender,
      reciever: receiver,
      roomId: roomId,
    });
    this.server.to(senderSocketId).emit("acceptedGameInvite", {
      sender: sender,
      reciever: receiver,
      roomId: roomId,
    });
  }
}
