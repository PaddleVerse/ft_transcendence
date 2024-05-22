import { Injectable } from '@nestjs/common';
import { PrismaClient,FriendshipStatus } from '@prisma/client';

@Injectable()
export class FriendshipService 
{
    private readonly prisma: PrismaClient;
    constructor() 
    {
        this.prisma = new PrismaClient();
    }

    async getFriendships()
    {
        try
        {
            const friendships = await this.prisma.friendship.findMany();
            return friendships;
        }
        catch (error)
        {
            return error;
        }
    }
    async getTopFriends(userid: number) {
        try
        {
            const friendships = await this.prisma.friendship.findMany({
                where: {
                    user_id: userid,
                    status: FriendshipStatus.ACCEPTED
                }
            });
            const friendslist = friendships.slice(0, 3);
            const actualFriends = [];
            for (const friend in friendslist) {
                const user = await this.prisma.user.findFirst({
                    where: {
                        id: friendslist[friend].friendId
                    }
                });
                actualFriends.push(user);
            }
            return actualFriends;
        }
        catch (error)
        {
            return error;
        }
    }
    async getFriends(userId: number)
    {
        try
        {
            const friends = await this.prisma.friendship.findMany({
                where: {
                    user_id: userId
                }
            });
            return friends;
        }
        catch (error)
        {
            throw error;
        }
    }

    async addFriend(userId: number, friendId: number, req : any) 
    {
        try
        {
            const friendship = await this.prisma.friendship.create({
                data: {
                    user_id: userId,
                    friendId: friendId,
                    request: req,
                    status: FriendshipStatus.PENDING
                }
            });
            return friendship;
        }
        catch (error)
        {
            return error;
        }
    }

    async acceptFriend(userId: number, friend_id: number) 
    {
        try
        {
            await this.prisma.friendship.updateMany({
                where: {
                    user_id : userId,
                    friendId : friend_id,
                    status: FriendshipStatus.PENDING
                },
                data: {
                  status: FriendshipStatus.ACCEPTED
                },
              });
        }
        catch (error)
        {
            return error;
        }
    }

    async removeFriend(userId: number, friend_id: number)
    {
        try
        {
            await this.prisma.friendship.deleteMany({
                where: {
                    user_id: +userId,
                    friendId: +friend_id
                }
            });
        }
        catch (error)
        {
            return error;
        }
    }

    async blockFriend(userId: number, friend_id: number, req : any)
    {
        try
        {
            // await this.prisma.friendship.deleteMany({
            //     where: {
            //         user_id: friend_id,
            //         friendId: userId
            //     }
            // });
            const user = await this.prisma.friendship.updateMany({
                where: {
                    user_id: userId,
                    friendId: friend_id,
                },
                data: {
                    request: req,
                    status: FriendshipStatus.BLOCKED
                },
              });
            if (user.count === 0)
            {
                await this.prisma.friendship.create({
                    data: {
                        user_id: userId,
                        friendId: friend_id,
                        request: req,
                        status: FriendshipStatus.BLOCKED
                    }
                });
            }
        }
        catch (error)
        {
            return error;
        }
    }

    async getFriendshipStatus(userId: number, friend_id: number)
    {
        try
        {
            const friendship = await this.prisma.friendship.findFirst({
                where: {
                    user_id: +userId,
                    friendId: +friend_id
                }
            });
            return {"status": friendship.status, "request": friendship.request};
        }
        catch (error)
        {
            return error;
        }
    }
}
