import { BadRequestException, Module } from '@nestjs/common';
import { PostImagesController } from './post-images.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { PostImagesService } from './post-images.service';
import { PostModule } from 'src/post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostImage } from './post-images.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([PostImage]),
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
    controllers: [PostImagesController],
    providers: [PostImagesService],
})
export class PostImagesModule {}
