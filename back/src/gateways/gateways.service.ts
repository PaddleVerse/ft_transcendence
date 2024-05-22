import { Injectable } from "@nestjs/common";
import { user } from "@prisma/client";

type userT = {
  id: number;
  nickname: string;
  socketId: string;
};

type room = {
  name: string;
  host: userT;
  users: Map<number, userT>;
};

@Injectable()
export class GatewaysService {
  rooms: room[] = [];
  matchQueue = new Map<number, userT>();

  async getRoom(name: string) {
    const room = this.rooms.findIndex((room) => room?.name === name);
    return room;
  }

  async addRoom(name: string, host: userT) {
    const room = await this.getRoom(name);
    if (room === -1) {
      this.rooms.push({ name, host, users: new Map() });
    }
  }

  async deleteRoom(name: string) {
    const room = await this.getRoom(name);
    if (room !== -1) {
      this.rooms = this.rooms.filter((room) => room?.name !== name);
    }
  }

  async getRoomHost(name: string) {
    const room = await this.getRoom(name);
    return this.rooms[room]?.host;
  }

  async addUserToRoom(name: string, user: userT) {
    const room = await this.getRoom(name);

    if (room !== -1) {
      this.rooms[room]?.users?.set(user.id, user);
    }
  }
  async RemoveUserFromRoom(name: string, user: number) {
    const room = await this.getRoom(name);
    if (room !== -1) {
      if (this.rooms[room]?.host?.id === user) {
        this.deleteRoom(name);
      } else {
        this.rooms[room]?.users?.delete(user);
      }
    }
  }

  async findRoomsByUserId(id: number): Promise<room[]> {
    const filteredRooms = this.rooms.filter((room) => {
      const found = room?.users?.get(id);
      if (found) {
        return found;
      }
    });
    return filteredRooms;
  }

  async removeUserFromAllRooms(id: number): Promise<void> {
    const rooms = await this.findRoomsByUserId(id);
    for (const room of rooms) {
      await this.RemoveUserFromRoom(room?.name, id);
    }
  }

  async matchmaking(user: any): Promise<string | null> {
    this.matchQueue.set(user.id, user);

    if (this.matchQueue.size >= 2) {
      const users = Array.from(this.matchQueue.values());
      const user1 = users[0];
      const user2 = users[1];
      const room = user1.nickname + user2.nickname + Date.now();
      await this.addRoom(room, user1);
      await this.addUserToRoom(room, user1);
      await this.addUserToRoom(room, user2);
      return room;
    }
    return null;
  }

  async leaveMatchmaking(user: any): Promise<void> {
    this.matchQueue.delete(user.id);
  }

  async leaveRoom(user: any): Promise<void> {
    this.leaveMatchmaking(user);
    const rooms = await this.findRoomsByUserId(user.id);
    for (const room of rooms) {
      await this.RemoveUserFromRoom(room?.name, user.id);
    }
  }
}
