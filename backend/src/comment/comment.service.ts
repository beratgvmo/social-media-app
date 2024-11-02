import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository, IsNull } from 'typeorm';
import { Post } from '../post/post.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,

        @InjectRepository(Post)
        private postsRepository: Repository<Post>,
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
        });

        if (post) {
            post.commetCount += 1;
            await this.postsRepository.save(post);
        }

        await this.commentRepository.save(newComment);
        return newComment;
    }
}
