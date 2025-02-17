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

    async getNotifications(userSlug: string): Promise<Notification[]> {
        return this.notificationRepository.find({
            where: { user: { slug: userSlug } },
            relations: ['fromUser', 'post'],
            order: { createdAt: 'DESC' },
        });
    }

    async countUnreadNotifications(userId: number): Promise<number> {
        console.log('Sorgulanan userId:', userId); // userId doğru mu?
        const unreadCount = await this.notificationRepository.count({
            where: {
                user: { id: userId },
                isRead: false,
            },
        });
        console.log('Veritabanı sorgusu sonucu:', unreadCount); // Sorgu sonucu
        return unreadCount;
    }

    async markAsRead(notificationId: number): Promise<void> {
        await this.notificationRepository.update(notificationId, {
            isRead: true,
        });
    }
}
