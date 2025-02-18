import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
    ) {}

    async getNotifications(userId: number): Promise<Notification[]> {
        const notifications = await this.notificationRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });

        if (notifications.length > 0) {
            await this.notificationRepository.update(
                { user: { id: userId }, isRead: false },
                { isRead: true },
            );
        }

        return notifications;
    }

    async getUnreadNotificationCount(userId: number): Promise<number> {
        const unreadCount = await this.notificationRepository.count({
            where: {
                user: { id: userId },
                isRead: false,
            },
        });
        return unreadCount;
    }
}
