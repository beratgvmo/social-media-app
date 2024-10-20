import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { PostImage } from '../post-images/post-images.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
        @InjectRepository(PostImage)
        private postImageRepository: Repository<PostImage>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async createPost(
        content: string,
        imageUrls: string[] = [],
        userId: number,
    ): Promise<Post> {
        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const post = this.postRepository.create({
            content,
            user,
        });

        const savedPost = await this.postRepository.save(post);

        if (imageUrls.length > 0) {
            const postImages = imageUrls.map((url) => {
                const postImage = this.postImageRepository.create({
                    url,
                    post: savedPost,
                });
                return postImage;
            });

            await this.postImageRepository.save(postImages);
        }

        return this.postRepository.findOne({
            where: { id: savedPost.id },
            relations: ['postImages', 'user'],
        });
    }

    async findAllPosts(page: number, limit: number): Promise<Post[]> {
        const skip = (page - 1) * limit;

        return this.postRepository.find({
            relations: ['postImages', 'user'],
            skip,
            take: limit,
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async findProfilPosts(
        page: number,
        limit: number,
        userSlug: string,
    ): Promise<Post[]> {
        const skip = (page - 1) * limit;

        return this.postRepository.find({
            where: {
                user: {
                    slug: userSlug,
                },
            },
            relations: ['postImages', 'user'],
            skip,
            take: limit,
            order: {
                createdAt: 'DESC',
            },
        });
    }
}
