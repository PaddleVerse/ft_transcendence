import { Body } from "@nestjs/common";
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { FriendshipService } from "src/friendship/friendship.service";
import { UserService } from "../user/user.service";
import {
  channel,
  N_Type,
  Prisma,
  PrismaClient,
  Req,
  Status,
  user,
} from "@prisma/client";
import { GatewaysService } from "./gateways.service";
import { ConversationsService } from "src/conversations/conversations.service";
import { NotificationsService } from "src/notifications/notifications.service";
import { ChannelsService } from "src/channels/channels.service";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class GatewaysGateway {
  private readonly prisma: PrismaClient;

  constructor(
    private readonly friendshipService: FriendshipService,
    private readonly userService: UserService,
    private readonly convService: ConversationsService,
    private readonly chanService: ChannelsService,
    private readonly gatewayService: GatewaysService,
    private readonly notificationService: NotificationsService
  ) {
    this.prisma = new PrismaClient();
  }
  @WebSocketServer() server: Server;

  async handleConnection(client: any) {
    const userId = await client.handshake.query?.userId;
    const socketId = client.id;

    const ss = this.userService.clients.hasOwnProperty(+userId);
    this.userService.clients[userId] = { socketId: client.id, socket: client };
    const user = await this.userService.getUserById(+userId);
    if (user) {
      if (!ss)
        await this.userService.updateUser(user.id, { status: Status.ONLINE });
      client.join(userId + "");
      this.server.to(userId).emit("connected", { userId, socketId });
    }
    // the chat part, where the user should join the rooms he is in if he gets reconnected
    // adding the channel reconnection to the socket server
    const channels = await this.chanService.getChannelsWithUserIdS(
      Number(userId)
    );
    channels.forEach(async (channel) => {
      client.join(channel.name);
    });
    // end of chat part
    this.server.emit("ok", { ok: 1 });
    console.log(`User ${userId} connected with socket ID ${client.id}`);
  }

  async handleDisconnect(client: any) {
    const socketId = client.id;
    for (const key in this.userService.clients) {
      if (this.userService.clients[key].socketId === socketId) {
        console.log(`Client with id ${key} disconnected.`);
        const user = await this.userService.getUserById(+key);
        if (user) {
          await this.userService.updateUser(user.id, {
            status: Status.OFFLINE,
          });
          // Leave the room with the userId
          // this.gatewayService.rooms.forEach((room) => {
          //   if (room.host.id === Number(key)) {
          //     client.leave(room.name);
          //   } else {
          //     room.users.forEach((user, id) => {
          //       if (Number(key) === user.id) {
          //         client.leave(room.name);
          //       }
          //     });
          //   }
          // });
          //hello
          client.leave(key + "");
          this.server.to(key).emit("disconnected", { userId: key, socketId });
          this.server.emit("ok", { ok: 1 });
          delete this.userService.clients[key];
        }
      }
    }
  }

  @SubscribeMessage("friendRequest")
  async handleFriendRequest(client: any, payload: any): Promise<string> {
    try {
      const id: any = await this.getSocketId(payload?.reciverId);
      await this.friendshipService.addFriend(
        payload?.senderId,
        payload?.reciverId,
        Req.SEND
      );
      await this.friendshipService.addFriend(
        payload?.reciverId,
        payload?.senderId,
        Req.RECIVED
      );
      await this.notificationService.createNotification(
        payload?.reciverId,
        N_Type.REQUEST,
        payload?.senderId
      );

      if (id === null) {
        this.server.to(client.id).emit("refresh", { ok: 0 });
        return "User not found.";
      }

      this.server.to(payload?.reciverId + "").emit("notification", payload);
      this.server.to(payload?.reciverId + "").emit("refresh", payload);
      this.server.to(payload?.senderId + "").emit("refresh", payload);
      return "Friend request received!";
    } catch (error) {
      return "Failed to receive friend request.";
    }
  }

  @SubscribeMessage("acceptFriendRequest")
  async handleAcceptFriendRequest(client: any, payload: any): Promise<string> {
    try {
      await this.friendshipService.acceptFriend(
        payload?.senderId,
        payload?.reciverId
      );
      await this.friendshipService.acceptFriend(
        payload?.reciverId,
        payload?.senderId
      );
      await this.convService.createConversation(
        payload?.senderId,
        payload?.reciverId
      );
      const id: any = this.getSocketId(payload?.senderId);
      if (id === null) {
        this.server.to(client.id).emit("refresh", { ok: 0 });
        return "User not found.";
      }
      this.server.to(payload?.senderId + "").emit("refresh", payload);
      this.server.to(payload?.reciverId + "").emit("refresh", payload);

      return "Friend request accepted!";
    } catch (error) {
      return "Failed to accept friend request.";
    }
  }

  @SubscribeMessage("rejectFriendRequest")
  async handleRejectFriendRequest(client: any, payload: any): Promise<string> {
    try {
      const id: any = await this.getSocketId(payload?.senderId);
      await this.friendshipService.removeFriend(
        payload?.senderId,
        payload?.reciverId
      );
      await this.friendshipService.removeFriend(
        payload?.reciverId,
        payload?.senderId
      );

      if (id === null) {
        this.server.to(client.id).emit("refresh", { ok: 0 });
        return "User not found.";
      }
      this.server.to(payload?.senderId + "").emit("refresh", payload);
      this.server.to(payload?.reciverId + "").emit("refresh", payload);
    } catch (error) {
      return "Failed to reject friend request.";
    }
    return "Friend request rejected!";
  }

  @SubscribeMessage("removeFriend")
  async handleRemoveFriend(client: any, payload: any): Promise<string> {
    try {
      const id: any = await this.getSocketId(
        payload?.is ? payload?.reciverId : payload?.senderId
      );
      await this.friendshipService.removeFriend(
        payload?.senderId,
        payload?.reciverId
      );
      await this.friendshipService.removeFriend(
        payload?.reciverId,
        payload?.senderId
      );
      await this.convService.deleteConversation(
        payload?.senderId,
        payload?.reciverId
      );
      if (id === null) {
        this.server.to(client.id).emit("refresh", { ok: 0 });
        return "User not found.";
      }
      this.server.to(payload?.reciverId + "").emit("refresh", payload);
      this.server.to(payload?.senderId + "").emit("refresh", payload);
      return "Friend removed!";
    } catch (error) {
      return "Failed to removed friend.";
    }
  }

  @SubscribeMessage("cancelFriendRequest")
  async handleCancelFriendRequest(client: any, payload: any): Promise<string> {
    try {
      await this.friendshipService.removeFriend(
        payload?.senderId,
        payload?.reciverId
      );
      await this.friendshipService.removeFriend(
        payload?.reciverId,
        payload?.senderId
      );
      const id: any = await this.getSocketId(payload?.reciverId);
      if (id === null) {
        this.server.to(client.id).emit("refresh", { ok: 0 });
        return "User not found.";
      }

      this.server.to(payload?.senderId + "").emit("refresh", payload);
      this.server.to(payload?.reciverId + "").emit("refresh", payload);

      return "Friend request canceled!";
    } catch (error) {
      return "Failed to cancele friend.";
    }
  }

  @SubscribeMessage("blockFriend")
  async handleBlockFriendRequest(client: any, payload: any): Promise<string> {
    try {
      await this.friendshipService.blockFriend(
        payload?.senderId,
        payload?.reciverId,
        Req.SEND
      );
      await this.friendshipService.blockFriend(
        payload?.reciverId,
        payload?.senderId,
        Req.RECIVED
      );
      await this.convService.deleteConversation(
        payload?.senderId,
        payload?.reciverId
      );
      const id: any = await this.getSocketId(payload?.reciverId);
      if (id === null) {
        this.server.to(client.id).emit("refresh", { ok: 0 });
        return "User not found.";
      }

      this.server.to(payload?.senderId + "").emit("refresh", payload);
      this.server.to(payload?.reciverId + "").emit("refresh", payload);

      return "Friend request canceled!";
    } catch (error) {
      return "Failed to cancele friend.";
    }
  }

  @SubscribeMessage("unblockFriend")
  async handleUnblockFriendRequest(client: any, payload: any): Promise<string> {
    try {
      const id: any = await this.getSocketId(payload?.reciverId);
      await this.friendshipService.removeFriend(
        payload?.senderId,
        payload?.reciverId
      );
      await this.friendshipService.removeFriend(
        payload?.reciverId,
        payload?.senderId
      );
      if (id === null) {
        this.server.to(client.id).emit("refresh", { ok: 0 });
        return "User not found.";
      }
      this.server.to(payload?.senderId + "").emit("refresh", payload);
      this.server.to(payload?.reciverId + "").emit("refresh", payload);
      return "Friend removed!";
    } catch (error) {
      return "Failed to cancele friend.";
    }
  }

  @SubscribeMessage("!notified")
  async handleNotified(client: any, payload: any): Promise<string> {
    try {
      await this.prisma.user.update({
        where: {
          id: +payload?.userId,
        },
        data: {
          notified: false,
        },
      });
      return "Notification deleted!";
    } catch (error) {
      return "Failed to delete notification.";
    }
  }

  getSocketId(userId: number): string {
    return this.userService.clients[userId] === undefined
      ? null
      : this.userService.clients[userId].socketId;
  }
  getSocket(userId: number): Socket {
    return this.userService.clients[userId] === undefined
      ? null
      : this.userService.clients[userId].socket;
  }

  @SubscribeMessage("dmmessage")
  async handleDmMessage(
    @ConnectedSocket() socket: Socket,
    @Body("sender") client: any,
    @Body("reciever") reciever: any
  ) {
    try {
      //some logic here to handle the message between the two users, mainly check the sockets and if they exist in the data base or not
      const id: any = this.getSocketId(reciever);
      this.server.to(id).emit("update", { dm: true }); // final result
      this.server.to(socket.id).emit("update", { dm: true, type: "dmMessage" }); // final result
    } catch (error) {}
  }

  // still under development
  @SubscribeMessage("joinRoom")
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @Body("user") client: user,
    @Body("roomName") roomName: string,
    @Body("type") type: string
  ) {
    try {
      const u = this.getSocketId(Number(client.id));
      if (u === null) {
        throw new Error("User not found.");
      }
      // const room = await this.gatewayService.getRoom(roomName);
      // if (room === -1) {
      //   await this.gatewayService.addRoom(roomName, {
      //     id: Number(client.id),
      //     nickname: client.nickname,
      //     socketId: u,
      //   });
      //   socket.join(roomName);
      //   this.server.to(roomName).emit("update", { type: "join" });
      //   return "done";
      // }
      // if (this.gatewayService.rooms.length > 0) {
      //   const part = await this.gatewayService.rooms[room].users.get(client.id);
      //   if (part) {
      //     return;
      //   }
      // }
      // if (type === "self") {
      //   await this.gatewayService.addUserToRoom(roomName, {
      //     id: Number(client.id),
      //     nickname: client.nickname,
      //     socketId: u,
      //   });
      //   socket.join(roomName);
      // } else {
      //   const soc = this.getSocket(client.id);
      //   await this.gatewayService.addUserToRoom(roomName, {
      //     id: Number(client.id),
      //     nickname: client.nickname,
      //     socketId: soc.id,
      //   });
      //   soc.join(roomName);
      // }
      // socket.join(roomName);
      console.log(client)
      const soc = this.getSocket(Number(client.id));
      soc.join(roomName);
      this.server.to(roomName).emit("update", { type: "join" });
    } catch (error) {
      this.server.to(socket.id).emit("error", error.toString());
    }
  }

  @SubscribeMessage("channelmessage")
  async handleChannelMessage(
    @ConnectedSocket() socket: Socket,
    @Body("channel") roomName: channel,
    @Body("user") user: user,
    @Body("message") message: any
  ) {
    try {
      const r = await this.gatewayService.getRoom(roomName.name);
      // if (r === -1) {
      //   console.log("Room not found.");
      //   throw new Error("Room not found.");
      // }
      // const u = await this.getSocketId(Number(user.id));
      // if (u === null) {
      //   throw new Error("User not found.");

      // }
      // console.log("the socket id is: ", u);
      this.server
        .to(roomName.name)
        .emit("update", { channel: true, type: "channelMessage" });
    } catch (error) {
      this.server.to(socket.id).emit("error", error.toString());
    }
  }

  @SubscribeMessage("leaveRoom")
  async handleLeaveRoom(
    @ConnectedSocket() socket: Socket,
    @Body("roomName") roomName: string,
    @Body("user") user: user
  ) {
    try {
      const soc = this.getSocket(Number(user.id));
      this.server.to(roomName).emit("update", { type: "leave" });
      soc.leave(roomName); 
      this.server.to(soc.id).emit("update", { type: "leave" });
    } catch (error) {}
  }
  @SubscribeMessage("kick")
  async handleKickRoom(
    @ConnectedSocket() socket: Socket,
    @Body("roomName") roomName: string,
    @Body("user") user: user
  ) {
    try {
      const u = this.getSocketId(Number(user.id));
      const s = this.getSocket(Number(user.id));
      this.server.to(u).emit("update", { type: "kicked" });
      s.leave(roomName);
      this.server.to(roomName).emit("update", { type: "channel" });
    } catch (error) {}
  }

  @SubscribeMessage("ban")
  async handleBanRoom(
    @ConnectedSocket() socket: Socket,
    @Body("roomName") roomName: string,
    @Body("user") user: user
  ) {
    try {
      const u = this.getSocketId(Number(user.id));
      const s = this.getSocket(Number(user.id));
      if (u === null) {
        throw new Error("User not found.");
      }
      this.server.to(u).emit("update", { type: "banned" });
      s.leave(roomName);
      this.server.to(roomName).emit("update", { type: "channel" });
    } catch (error) {}
  }

  @SubscribeMessage("channelUpdate")
  async handleChannelUpdate(
    @ConnectedSocket() Socket: Socket,
    @Body("roomName") roomName: string,
    @Body("user") user: user
  ) {
    try {
      const chs = await this.chanService.getChannelsWithUserIdS(user.id);
      const soc = this.getSocket(user.id);
      chs.forEach((channel) => {
        soc.join(channel.name);
      })
      this.server.to(roomName).emit("update", { type: "channelupdate" });
    } catch (error) {}
  }

  @SubscribeMessage("typing")
  async handleTyping(
    @Body("sender") user: user,
    @Body("reciever") reciever: user,
    @Body("roomName") roomName: string,
    @Body("roomId") roomId: string,
    @Body("type") type: string
  ) {
    try {
      if (type === "dm") {
        const id: any = this.getSocketId(reciever.id);
        this.server.to(id).emit("update", {
          target: "dm",
          typing: true,
          type: "typing",
          sender: user,
          reciever: reciever,
          t: true,
        });
      } else {
        this.server.to(roomName).emit("update", {
          typing: true,
          type: "typing",
          target: "channel",
          sender: user,
          reciever: reciever,
          id: roomId,
          roomName: roomName,
          t: false,
        });
      }
    } catch (error) {}
  }

  @SubscribeMessage("GameInvite")
  async handleGameInvite(
    @Body("sender") sender: user,
    @Body("reciever") reciever: user
  ) {
    if (!reciever || !sender) return;
    try {
      const id: any = this.getSocketId(reciever.id);
      const senderId: any = this.getSocketId(sender.id);
      const usr = await this.userService.getUserById(reciever.id);
      if (!usr) return;
      if (usr.status === Status.IN_GAME) {
        this.server.to(senderId).emit("userInGame", {});
        this.server.to(id).emit("userInGame", {});
        return;
      }
      this.server.to(id).emit("invited", { sender: sender });
    } catch (error) {}
  }
}
