import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostImage } from '../post-images/post-images.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { BadRequestException } from '@nestjs/common';
import { User } from 'src/user/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post, PostImage, User]),
        MulterModule.register({
            storage: diskStorage({
                destination: (req, file, cb) => {
                    cb(null, 'src/img');
                },
                filename: (req, file, cb) => {
                    const extension = extname(file.originalname).toLowerCase();
                    const filename = `${randomUUID()}${extension}`;
                    cb(null, filename);
                },
            }),
            fileFilter: (req, file, cb) => {
                const allowedMimeTypes = [
                    'image/jpeg',
                    'image/png',
                    'image/webp',
                ];

                if (allowedMimeTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(
                        new BadRequestException(
                            'Only JPEG, PNG, and WEBP images are allowed',
                        ),
                        false,
                    );
                }
            },
        }),
    ],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {}
