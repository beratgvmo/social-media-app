import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostImage } from './post-images.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostImagesService {
    constructor(
        @InjectRepository(PostImage)
        private postImageRepository: Repository<PostImage>,
    ) {}

    async createImage(imagePath: string): Promise<PostImage> {
        const postImage = this.postImageRepository.create({
            url: imagePath,
        });

        return await this.postImageRepository.save(postImage);
    }
}
