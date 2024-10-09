import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { PostImage } from '../post-images/post-images.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
        @InjectRepository(PostImage)
        private postImageRepository: Repository<PostImage>,
    ) {}

    async createPost(content: string, imageUrls: string[]): Promise<Post> {
        const post = this.postRepository.create({ content });

        const savedPost = await this.postRepository.save(post);
        const postImages = imageUrls.map((url, index) => {
            const postImage = this.postImageRepository.create({
                url,
                order: index,
                post: savedPost,
            });
            return postImage;
        });

        await this.postImageRepository.save(postImages);

        return savedPost;
    }
}
