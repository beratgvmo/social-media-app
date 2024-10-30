import { Controller, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get('post/:postId')
    async getCommetsByPost(
        @Param('postId') postId: number,
    ): Promise<Comment[]> {
        return this.commentService.getCommentsByPost(postId);
    }
}
