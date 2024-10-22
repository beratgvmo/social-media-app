import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';
import { User } from '../user/user.entity';

@Injectable()
export class LikeService {
    constructor(
        @InjectRepository(Like)
        private readonly likeRepository: Repository<Like>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async likePost(userId: number, postId: number): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: ['user'],
        });
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        const existingLike = await this.likeRepository.findOne({
            where: { user: { id: userId }, post: { id: postId } },
        });

        if (!existingLike) {
            const like = this.likeRepository.create({ user, post });
            await this.likeRepository.save(like);

            post.likeCount += 1;
            await this.postRepository.save(post);
        }

        return post;
    }

    async unlikePost(userId: number, postId: number): Promise<number> {
        const post = await this.postRepository.findOne({
            where: { id: postId },
        });

        await this.likeRepository.delete({
            user: { id: userId },
            post: { id: postId },
        });

        post.likeCount -= 1;
        await this.postRepository.save(post);

        return post.likeCount;
    }

    async checkPostLikeStatus(
        userId: number,
        postId: number,
    ): Promise<{ status: boolean; count: number }> {
        const like = await this.likeRepository.findOne({
            where: { user: { id: userId }, post: { id: postId } },
        });
        const post = await this.postRepository.findOne({
            where: { id: postId },
        });
        return { status: !!like, count: post.likeCount };
    }

    async likeComment(userId: number, comId: number): Promise<void> {
        const comment = await this.commentRepository.findOne({
            where: { id: comId },
        });
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        const like = this.likeRepository.create({ user, comment });
        await this.likeRepository.save(like);
    }

    async unlikeComment(userId: number, comId: number): Promise<void> {
        await this.likeRepository.delete({
            user: { id: userId },
            comment: { id: comId },
        });
    }

    async checkCommentLikeStatus(
        userId: number,
        comId: number,
    ): Promise<boolean> {
        const like = await this.likeRepository.findOne({
            where: { user: { id: userId }, comment: { id: comId } },
        });
        return !!like;
    }
}
