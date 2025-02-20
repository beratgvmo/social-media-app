import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository, IsNull, In } from 'typeorm';
import { Post } from '../post/post.entity';
import { Notification } from 'src/notification/notification.entity';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { Like } from '../like/like.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,

        @InjectRepository(Post)
        private postsRepository: Repository<Post>,

        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,

        @InjectRepository(Like)
        private likeRepository: Repository<Like>,

        private readonly notificationGateway: NotificationGateway,
    ) {}

    async getCommentsByPost(postId: number): Promise<Comment[]> {
        return await this.commentRepository.find({
            where: { post: { id: postId }, parentComment: IsNull() },
            relations: ['user', 'replies', 'replies.user'],
        });
    }

    async addComment(
        content: string,
        postId: number,
        userId: number,
        parentCommentId?: number,
    ): Promise<Comment> {
        const newComment = this.commentRepository.create({
            content,
            post: { id: postId },
            user: { id: userId },
            parentComment: parentCommentId ? { id: parentCommentId } : null,
        });

        const post = await this.postsRepository.findOne({
            where: { id: postId },
            relations: ['user'],
        });

        if (!post) {
            throw new Error('Post bulunamadı');
        }

        if (post.user && post.user.id !== userId) {
            const notification = this.notificationRepository.create({
                post: { id: postId },
                type: 'comment',
                user: { id: post.user.id },
                fromUser: { id: userId },
            });

            await this.notificationRepository.save(notification);

            this.notificationGateway.handleMessage(null, post.user.id);
        }

        post.commentCount += 1;
        await this.postsRepository.save(post);

        await this.commentRepository.save(newComment);
        return newComment;
    }

    async deleteComment(commentId: number, userId: number): Promise<void> {
        const comment = await this.commentRepository.findOne({
            where: { id: commentId },
            relations: ['post', 'user'],
        });

        if (!comment) {
            throw new Error('Yorum bulunamadı');
        }

        if (comment.user.id !== userId) {
            throw new Error('Bu yorumu silme yetkiniz yok');
        }

        const commentReplies = await this.commentRepository.find({
            where: { replies: { id: commentId } },
            relations: ['likes'],
        });

        const commentReplyIds = commentReplies.map((reply) => reply.id);

        if (commentReplyIds.length > 0) {
            await this.likeRepository.delete({
                comment: In(commentReplyIds),
            });

            await this.commentRepository.delete({
                id: In(commentReplyIds),
            });
        }

        await this.likeRepository.delete({
            comment: { id: commentId },
        });

        await this.commentRepository.delete(commentId);

        const post = await this.postsRepository.findOne({
            where: { id: comment.post.id },
            relations: ['user'],
        });

        await this.notificationRepository.delete({
            post: { id: comment.post.id },
            type: 'comment',
            fromUser: { id: userId },
        });

        if (post) {
            post.commentCount -= 1;
            await this.postsRepository.save(post);
            this.notificationGateway.handleMessage(null, post.user.id);
        }
    }
}
