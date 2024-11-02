import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

    @Post('add')
    async addComment(
        @Body('content') content: string,
        @Body('postId') postId: number,
        @Body('userId') userId: number,
        @Body('parentCommentId') parentCommentId?: number,
    ): Promise<Comment> {
        return this.commentService.addComment(
            content,
            postId,
            userId,
            parentCommentId,
        );
    }
}
