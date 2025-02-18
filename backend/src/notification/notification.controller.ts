import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getNotification(@Req() req: Request) {
        const userId = req.user['sub'];
        return this.notificationService.getNotifications(userId);
    }
}
