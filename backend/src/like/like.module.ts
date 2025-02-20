import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { Like } from './like.entity';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';
import { User } from '../user/user.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { Notification } from 'src/notification/notification.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Like, Post, Comment, User, Notification]),
        NotificationModule,
    ],
    controllers: [LikeController],
    providers: [LikeService],
})
export class LikeModule {}
