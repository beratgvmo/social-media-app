import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostImage } from '../post-images/post-images.entity';
import { PostImagesService } from '../post-images/post-images.service';

@Module({
    imports: [TypeOrmModule.forFeature([Post, PostImage])],
    controllers: [PostController],
    providers: [PostService, PostImagesService],
})
export class PostModule {}
