import { Controller, Delete, UseGuards, Get, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController 
{
    constructor (private readonly notService:NotificationsService) {}

    @Delete(':id')
    async deleteNotification(@Param('id') id: number)
    {
        return await this.notService.deleteAllNotifications(id);
    }
}
