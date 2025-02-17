import { Controller, Get, Param, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Get(':userSlug')
    async getNotification(@Param('userSlug') userSlug: string) {
        return this.notificationService.getNotifications(userSlug);
    }

    @Post('read/:notificationId')
    async markAsRead(@Param('notificationId') notificationId: string) {
        return this.notificationService.markAsRead(Number(notificationId));
    }
}
