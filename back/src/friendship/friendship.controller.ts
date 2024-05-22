import { Controller, Delete,UseGuards, Get, Param, Query } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('friendship')
@UseGuards(JwtAuthGuard)
export class FriendshipController
{
    constructor(private readonly friendshipService: FriendshipService) {}

    @Get()
    getFriendships()
    {
        return this.friendshipService.getFriendships();
    }

    @Get("top")
    async getTopFriends(@Query('userid') userid: string) {
        return await this.friendshipService.getTopFriends(Number(userid));
    }
    
    @Get(':id')
    getFriends(@Param('id') id: number)
    {
        return this.friendshipService.getFriends(+id);
    }
    
    @Get('/status/:userId/:friendId')
    getFriendshipStatus(@Param('userId') userId: number, @Param('friendId') friendId: number)
    {
        return this.friendshipService.getFriendshipStatus(userId, friendId);
    }

    @Get('add/:userId/:friendId')
    addFriend(@Param('userId') userId: number, @Param('friendId') friendId: number)
    {
        // return this.friendshipService.addFriend(userId, friendId);
    }

    @Get('accept/:userId/:friendId')
    acceptFriend(@Param('userId') userId: number, @Param('friendId') friendId: number)
    {
        // return this.friendshipService.acceptFriend(userId, friendId);
    }

    @Delete('remove/:userId/:friendId')
    async removeFriend(@Param('userId') userId: number, @Param('friendId') friendId: number)
    {
        return await this.friendshipService.removeFriend(userId, friendId);
    }
}
