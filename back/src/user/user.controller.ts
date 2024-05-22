import { Body, Controller, Delete, Get, Param, Put, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from 'multer';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController 
{
    constructor (private readonly userService : UserService) {}
    
    @Get()
    async getUsers() 
    {
        return this.userService.getUsers();
    }
    
    @Get('top')
    getTopThreeUsers()
    {
        return this.userService.getTopThreeUsers();
    }

    @Get(':id')
    getUser(@Param('id') id: any)
    {
        return this.userService.getUser(+id);
    }
    
    @Get('range/:id')
    getTopUsers(@Param('id') id: any)
    {
        return this.userService.getNeighbours(+id);
    }

    @Put('img/:id')
    @UseInterceptors(FileInterceptor('image'))
    async updateUserPic(@Param('id') id: any, @UploadedFile() file: `MulterFile`)
    {
        const url = await this.userService.uploadImage(file);
        return await this.userService.updateUser(+id, { picture: url });
    }

    @Put(':id')
    async updateUser(@Param('id') id: any, @Body() data: UpdateUserDto)
    {   
        return await this.userService.editUser(+id, data);
    }

    @Put('visible/:id')
    async updateUserVisite(@Param('id') id: any, @Body() data: any)
    {
        return await this.userService.updateUserVisite(+id, data);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: any)
    {
        return this.userService.deleteUser(+id);
    }

    @Get('linked/:userId/:friendId')
    getLinkedUsers(@Param('userId') userid: any, @Param('friendId') friendId: any)
    {
        return this.userService.getLinkedFriends(+userid, +friendId);
    }
}
