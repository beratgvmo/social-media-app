import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';
import { User } from '../user/user.entity';
import { Notification } from 'src/notification/notification.entity';
import { NotificationGateway } from 'src/notification/notification.gateway';

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

        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,

        private readonly notificationGateway: NotificationGateway,
    ) {}

    async likePost(userId: number, postId: number): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: ['user'],
        });

        if (!post) {
            throw new Error('Post bulunamadı');
        }

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new Error('Kullanıcı bulunamadı');
        }

        const existingLike = await this.likeRepository.findOne({
            where: { user: { id: userId }, post: { id: postId } },
        });

        if (existingLike) {
            return post;
        }

        if (post.user && post.user.id !== userId) {
            const notification = this.notificationRepository.create({
                post: { id: postId },
                type: 'like',
                user: { id: post.user.id },
                fromUser: { id: userId },
            });

            await this.notificationRepository.save(notification);

            this.notificationGateway.handleMessage(null, post.user.id);
        }

        const like = this.likeRepository.create({ user, post });
        await this.likeRepository.save(like);

        post.likeCount += 1;
        await this.postRepository.save(post);

        return post;
    }

    async unlikePost(userId: number, postId: number): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: { id: postId },
        });

        if (!post) {
            throw new Error('Post bulunamadı');
        }

        const like = await this.likeRepository.findOne({
            where: { user: { id: userId }, post: { id: postId } },
        });

        if (!like) {
            throw new Error('Beğeni bulunamadı');
        }

        await this.likeRepository.delete(like.id);

        const notification = await this.notificationRepository.findOne({
            where: {
                post: { id: postId },
                type: 'like',
                fromUser: { id: userId },
            },
        });

        if (notification) {
            await this.notificationRepository.delete(notification.id);

            if (post.user) {
                this.notificationGateway.handleMessage(null, post.user.id);
            }
        }

        post.likeCount -= 1;
        await this.postRepository.save(post);

        return post;
    }

    async checkPostLikeStatus(
        userId: number,
        postId: number,
    ): Promise<{ status: boolean; count: number }> {
        const [like, post] = await Promise.all([
            this.likeRepository.findOne({
                where: { user: { id: userId }, post: { id: postId } },
            }),
            this.postRepository.findOne({ where: { id: postId } }),
        ]);

        if (!post) {
            throw new Error('Post bulunamadı');
        }

        return { status: !!like, count: post.likeCount };
    }

    async likeComment(userId: number, comId: number): Promise<Comment> {
        const comment = await this.commentRepository.findOne({
            where: { id: comId },
        });

        if (!comment) {
            throw new Error('Yorum bulunamadı');
        }

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new Error('Kullanıcı bulunamadı');
        }

        const existingLike = await this.likeRepository.findOne({
            where: { user: { id: userId }, comment: { id: comId } },
        });

        if (existingLike) {
            return comment;
        }

        const like = this.likeRepository.create({ user, comment });
        await this.likeRepository.save(like);

        comment.likeCount += 1;
        await this.commentRepository.save(comment);

        return comment;
    }

    async unlikeComment(userId: number, comId: number): Promise<Comment> {
        const comment = await this.commentRepository.findOne({
            where: { id: comId },
        });

        if (!comment) {
            throw new Error('Yorum bulunamadı');
        }

        const like = await this.likeRepository.findOne({
            where: { user: { id: userId }, comment: { id: comId } },
        });

        if (!like) {
            throw new Error('Beğeni bulunamadı');
        }

        await this.likeRepository.delete(like.id);

        comment.likeCount -= 1;
        await this.commentRepository.save(comment);

        return comment;
    }

    async checkCommentLikeStatus(
        userId: number,
        comId: number,
    ): Promise<{ status: boolean; count: number }> {
        const like = await this.likeRepository.findOne({
            where: { user: { id: userId }, comment: { id: comId } },
        });
        const comment = await this.commentRepository.findOne({
            where: { id: comId },
        });

        if (!comment) {
            throw new Error('Yorum bulunamadı');
        }

        return { status: !!like, count: comment.likeCount };
    }
}
