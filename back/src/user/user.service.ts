import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { MulterFile } from "multer";
import { Socket } from "socket.io";
import { UpdateUserDto } from "src/auth/dto/update-user.dto/update-user.dto";
import * as cloudinary from "cloudinary";

interface ClientData {
  [userId: number]: { socketId: string; socket: Socket };
}

@Injectable()
export class UserService {
  private readonly prisma: PrismaClient;
  public clients: ClientData = {};
  constructor() {
    this.prisma = new PrismaClient();
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async getUsers() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          first_time: true,
          nickname: true,
          name: true,
          middlename: true,
          picture: true,
          banner_picture: true,
          status: true,
          level: true,
          twoFa: true,
          twoFaSecret: true,
          createdAt: true,
          xp: true,
          notified: true,
          friends: true,
          achievements: true,
          channel_participants: true,
          coins: true,
          paddles: true,
          balls: true,
          notifications: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
      return users;
    } catch (error) {
      return null;
    }
  }

  async getUser(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        select: {
          id: true,
          first_time: true,
          nickname: true,
          name: true,
          middlename: true,
          picture: true,
          banner_picture: true,
          status: true,
          level: true,
          createdAt: true,
          xp: true,
          notified: true,
          twoFaSecret: true,
          twoFa: true,
          friends: true,
          achievements: true,
          channel_participants: true,
          coins: true,
          paddles: true,
          balls: true,
          
          notifications: {
            orderBy: { createdAt: "desc" },
          },
        },
        where: {
          id,
        },
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  async getTopThreeUsers() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          first_time: true,
          nickname: true,
          name: true,
          middlename: true,
          picture: true,
          banner_picture: true,
          status: true,
          level: true,
          createdAt: true,
          xp: true,
          notified: true,
          friends: true,
          achievements: true,
          channel_participants: true,
          coins: true,
          paddles: true,
          balls: true,
          
          notifications: {
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: {
          level: "desc",
        },
        take: 3,
      });
      return users;
    } catch (error) {
      return null;
    }
  }

  async getTopUsers() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          first_time: true,
          nickname: true,
          name: true,
          middlename: true,
          picture: true,
          banner_picture: true,
          status: true,
          level: true,
          createdAt: true,
          notified: true,
          friends: true,
          achievements: true,
          channel_participants: true,
          coins: true,
          paddles: true,
          xp: true,
          balls: true,
          
          notifications: {
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: {
          level: "desc",
        },
        take: 10,
      });
      return users;
    } catch (error) {
      return null;
    }
  }

  async getNeighbours(id: any) {
    try {
      const users = await this.getUsers();
      users.sort((a: any, b: any) => b.xp - a.xp);
      return users.slice(0, 20);
    } catch (error) {
      return null;
    }
  }

  async getUserById(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          nickname: true,
          name: true,
          middlename: true,
          picture: true,
          banner_picture: true,
          status: true,
          level: true,
          createdAt: true,
          notified: true,
          friends: true,
          xp: true,
          achievements: true,
          channel_participants: true,
          coins: true,
          paddles: true,
          balls: true,
          
          notifications: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  async findOne(nickname: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          nickname,
        },
        select: {
          id: true,
          first_time: true,
          nickname: true,
          name: true,
          middlename: true,
          password: true,
          picture: true,
          banner_picture: true,
          status: true,
          level: true,
          xp: true,
          win_streak: true,
          twoFa: true,
          twoFaSecret: true,
          createdAt: true,
          notified: true,
          friends: true,
          achievements: true,
          channel_participants: true,
          coins: true,
          paddles: true,
          balls: true,

          notifications: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  async findOrCreateGoogleUser(profile: any) {
    try {
      const { id, displayName, emails } = profile;
      const photo = await profile.photos[0].value;

      let user = await this.prisma.user.findUnique({
        where: {
          googleId: id,
        },
      });

      let check = await this.prisma.user.findUnique({
        where: {
          nickname: emails[0]?.value,
        },
      });
      if (check) {
        emails[0].value = emails[0].value + id;
      }

      if (!user) {
        const random = Math.floor(Math.random() * 1000000);
        const res = random.toString();
        const pw = await bcrypt.hash(res, 10);
        user = await this.prisma.user.create({
          data: {
            googleId: id,
            name: displayName,
            nickname: emails[0]?.value || id,
            password: pw,
            picture: photo,
          },
        });
      }
      return user;
    } catch (error) {
      return null;
    }
  }

  async findOrCreateFortyTwoUser(profile: any) {
    try {
      let { id, nickname } = profile;
      const name = profile._json.first_name + " " + profile._json.last_name;
      const pic = profile._json.image.link;
      let user = await this.prisma.user.findUnique({
        where: {
          fortytwoId: id,
        },
      });
      let check = await this.prisma.user.findUnique({
        where: {
          nickname: nickname,
        },
      });
      if (check) {
        nickname = nickname + id;
      }
      if (!user) {
        const random = Math.floor(Math.random() * 1000000);
        const res = random.toString();
        const pw = await bcrypt.hash(res, 10);
        user = await this.prisma.user.create({
          data: {
            fortytwoId: id,
            name: name,
            nickname: nickname,
            password: pw,
            picture: pic,
          },
        });
      }

      return user;
    } catch (error) {
      return null;
    }
  }

  async updateUser(id: number, data: any) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data,
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await this.prisma.user.delete({
        where: {
          id,
        },
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  async uploadImage(file: MulterFile): Promise<string> {
    const base64String = file.buffer.toString("base64");
    const result = await cloudinary.v2.uploader.upload(
      `data:${file.mimetype};base64,${base64String}`,
      { resource_type: "auto" }
    );
    return result.secure_url;
  }

  async editUser(id: number, data: UpdateUserDto) {
    const { name, middlename } = data;
    if (!name || !middlename || name.length < 3 || middlename.length < 3)
      return null;
    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name: name,
        middlename: middlename,
      },
    });
    return updatedUser;
  }

  async getLinkedFriends(userId: number, friendId: number) {
    try {
      const user: any = await this.getUserById(userId);
      const friend: any = await this.getUserById(friendId);

      let friends = [];
      for (let i = 0; i < user.friends.length; i++) {
        for (let j = 0; j < friend.friends.length; j++) {
          if (
            user.friends[i].friendId === friend.friends[j].friendId &&
            friend.friends[i].status === "ACCEPTED" &&
            user.friends[j].status === "ACCEPTED"
          )
            friends.push(await this.getUserById(+user.friends[i].friendId));
          if (friends.length === 7) return friends;
        }
      }
      return friends;
    } catch (error) {
      return null;
    }
  }

  async updateUserVisite(id: number, data: any) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          first_time: data.first_time,
        },
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  async addCoins(id: number, coins: number) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          coins: {
            increment: coins,
          },
        },
      });
      return user;
    } catch (error) {
      return null;
    }
  }
}
