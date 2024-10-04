import { Module } from '@nestjs/common';
import { PostImagesController } from './post-images.controller';

@Module({
    controllers: [PostImagesController],
})
export class PostImagesModule {}
