import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get('post/:postId')
    async getCommetsByPost(
        @Param('postId') postId: number,
    ): Promise<Comment[]> {
        return this.commentService.getCommentsByPost(postId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('add')
    async addComment(
        @Req() req: Request,
        @Body('content') content: string,
        @Body('postId') postId: number,
        @Body('parentCommentId') parentCommentId?: number,
    ): Promise<Comment> {
        const userId = req.user['sub'];
        return this.commentService.addComment(
            content,
            postId,
            userId,
            parentCommentId,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':commentId')
    async deleteComment(
        @Param('commentId') commentId: number,
        @Req() req: Request,
    ): Promise<void> {
        const userId = req.user['sub'];
        return this.commentService.deleteComment(commentId, userId);
    }
}
