import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private commentsRepository: Repository<Comment>,
    ) {}

    async getCommentsByPost(postId: number): Promise<Comment[]> {
        return this.commentsRepository.find({
            where: { post: { id: postId }, parentComment: null },
            relations: ['user', 'likes', 'replies', 'replies.user'],
        });
    }
}
