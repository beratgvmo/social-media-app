import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GithubType, Post, PostType } from './post.entity';
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
        postType: PostType,
        githubApiUrl: string,
        githubType: GithubType,
        imageUrls: string[] = [],
        userId: number,
    ): Promise<Post> {
        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const post = this.postRepository.create({
            content,
            postType,
            githubType: githubType || null,
            githubApiUrl: githubApiUrl || null,
            user,
        });

        const savedPost = await this.postRepository.save(post);

        if (imageUrls.length > 0) {
            const postImages = imageUrls.map((url) =>
                this.postImageRepository.create({ url, post: savedPost }),
            );

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

    async deletePost(postId: number, userId: number): Promise<void> {
        const post = await this.postRepository.findOne({
            where: { id: postId, user: { id: userId } },
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        await this.postRepository.remove(post);
    }
}
