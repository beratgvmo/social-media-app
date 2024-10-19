import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { Like } from './like.entity';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';
import { User } from '../user/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Like, Post, Comment, User])],
    controllers: [LikeController],
    providers: [LikeService],
})
export class LikeModule {}
