import { Injectable } from '@nestjs/common';
import { N_Type, PrismaClient } from '@prisma/client';

@Injectable()
export class NotificationsService 
{
    private readonly prisma: PrismaClient
    constructor () 
    {
        this.prisma = new PrismaClient();
    }

    async getNotificationsByUserId(userId: number)
    {
        try
        {
            const notifications = await this.prisma.notification.findMany({
                where: {
                    user_id: userId
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return notifications;
        }
        catch (error)
        {
            return null;
        }
    }

    async createNotification(userId: number, type: N_Type, senderId: number)
    {
        try
        {
            await this.prisma.user.update({
                where: {
                    id: +userId
                },
                data: {
                    notified: true
                }
            });
            const existingNotification = await this.prisma.notification.findFirst({
                where: {
                    sender_id: senderId,
                    user_id: userId,
                    type: type,
                }
            });
            if (existingNotification) return null;
            const user = await this.prisma.user.findUnique({
                where: {
                    id: senderId
                }
            });
            if (!user) return null;
            const notification = await this.prisma.notification.create({
                data: {
                    user_id: userId,
                    sender_name: user?.name,
                    sender_picture: user?.picture,
                    sender_id : senderId,
                    type: type,
                }
            });
            return notification;
        }
        catch (error)
        {
            return null;
        }
    }

    async deleteNotification(id: number)
    {
        try
        {
            await this.prisma.notification.delete({
                where: {
                    id: id
                }
            });
            return true;
        }
        catch (error)
        {
            return false;
        }
    }

    async deleteAllNotifications(userId: number)
    {
        try
        {
            await this.prisma.notification.deleteMany({
                where: {
                    user_id: +userId
                }
            });
            return true;
        }
        catch (error)
        {
            return false;
        }
    }
}
