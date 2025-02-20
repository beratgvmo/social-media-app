import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Post } from '../post/post.entity';
import { Notification } from 'src/notification/notification.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { Like } from 'src/like/like.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([Comment, Post, Notification, Like]),
        NotificationModule,
    ],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule {}
