import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Post } from 'src/post/post.entity';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
    ) {}

    async createNotification(
        user: User,
        type: 'comment' | 'like' | 'followRequest',
        fromUser: User,
        post?: Post,
    ): Promise<Notification> {
        const notification = this.notificationRepository.create({
            user,
            type,
            fromUser,
            post,
        });

        return this.notificationRepository.save(notification);
    }

    async getNotifications(userSlug: string): Promise<Notification[]> {
        return this.notificationRepository.find({
            where: { user: { slug: userSlug } },
            relations: ['fromUser', 'post'],
            order: { createdAt: 'DESC' },
        });
    }

    async markAsRead(notificationId: number): Promise<void> {
        await this.notificationRepository.update(notificationId, {
            isRead: true,
        });
    }

    async removeNotification(
        userId: number,
        postId: number,
        PostUserId: number,
        type: 'like',
    ): Promise<void> {
        await this.notificationRepository.delete({
            user: { id: PostUserId },
            post: { id: postId },
            fromUser: { id: userId },
            type,
        });
    }
}
