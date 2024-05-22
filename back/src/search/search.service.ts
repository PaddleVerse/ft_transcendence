import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SearchService 
{
    private readonly prisma : PrismaClient;
    constructor(private readonly userService : UserService)
    {
        this.prisma = new PrismaClient();
    }

    async getAll()
    {
        return await this.prisma.searchHistory.findMany();
    }

    async filterSearch(name: string, userId: number)
    {
        try
        {
            const filteredUsers = await this.prisma.user.findMany({
            where: {
                id: {
                    not: userId,
                },
                name: {
                    contains: name.toLowerCase(),
                    mode: 'insensitive',
                },
            },
            });
            return filteredUsers;
        }
        catch (error) { return []; }
    }

    async getSearchedUsers(userId: number) {
        try {
            const srchs = await this.getAll();
            const users = await this.userService.getUsers();
            const usersID = srchs?.filter((user: any) => user?.searchingUserId === userId).map((user: any) => user?.userId);
            if (!usersID) return [];
            const res = usersID.map((id: any) => users.filter((user: any) => user?.id === id));
            return res.flat();
        } catch (error) {
            return error;
        }
    }
    

    async addSearch(user_id : number, searshingUserId : number)
    {
        try {
            const prev = await this.prisma.searchHistory.findFirst({
                where: {
                    userId : user_id,
                    searchingUserId : searshingUserId
                }
            });
            if (prev) return prev;
            return await this.prisma.searchHistory.create({
                data: {
                    userId : user_id,
                    searchingUserId : searshingUserId
                }
            });
        } catch (error) {
            return error;
        }
    }

    async deleteSearch(id : number)
    {
        try {
            return await this.prisma.searchHistory.delete({
                where: {
                    id
                }
            });
        } catch (error) {
            return error;
        }
    }
}
