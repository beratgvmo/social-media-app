import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { User } from './user.entity';
import { Like } from '../like/like.entity';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';
import { Message } from '../chat/message.entity';
import { Follower } from '../follower/follower.entity';
import { ChatRoom } from '../chat/chat-room.entity';
import { PostImage } from 'src/post-images/post-images.entity';
import { PostSaved } from 'src/post-saved/post-saved.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Like,
            Post,
            Comment,
            Message,
            Follower,
            ChatRoom,
            PostImage,
            PostSaved,
        ]),
        MulterModule.register({
            storage: diskStorage({
                destination: (req, file, cb) => {
                    cb(null, 'src/img');
                },
                filename: (req, file, cb) => {
                    const extension =
                        file.mimetype === 'image/jpeg'
                            ? '.jpeg'
                            : extname(file.originalname);
                    const filename = `${randomUUID()}${extension}`;
                    cb(null, filename);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (
                    file.mimetype === 'image/jpeg' ||
                    file.mimetype === 'image/png'
                ) {
                    cb(null, true);
                } else {
                    cb(
                        new Error('Only JPEG and PNG images are allowed'),
                        false,
                    );
                }
            },
        }),
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
