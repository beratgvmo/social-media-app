import {
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('like')
export class LikeController {
    constructor(private readonly likeService: LikeService) {}

    @UseGuards(JwtAuthGuard)
    @Post('post/:postId')
    async postLike(@Param('postId') postId: number, @Req() req: Request) {
        const userId = req.user['sub'];

        try {
            const likedPost = await this.likeService.likePost(userId, postId);

            return {
                success: true,
                message: 'Post başarıyla beğenildi.',
                likeCount: likedPost.likeCount,
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Post beğenme işlemi başarısız.',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('remove/post/:postId')
    async removePostLike(@Param('postId') postId: number, @Req() req: Request) {
        const userId = req.user['sub'];

        try {
            const updatedPost = await this.likeService.unlikePost(
                userId,
                postId,
            );

            return {
                success: true,
                message: 'Like başarıyla kaldırıldı.',
                likeCount: updatedPost.likeCount,
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Like kaldırma işlemi başarısız.',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('status/post/:postId')
    async checkPostStatus(
        @Param('postId') postId: number,
        @Req() req: Request,
    ) {
        const userId = req.user['sub'];
        return this.likeService.checkPostLikeStatus(userId, postId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('comment/:comId')
    async commentLike(@Param('comId') comId: number, @Req() req: Request) {
        const userId = req.user['sub'];
        return this.likeService.likeComment(userId, comId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('remove/comment/:comId')
    async removeCommentLike(
        @Param('comId') comId: number,
        @Req() req: Request,
    ) {
        const userId = req.user['sub'];
        return this.likeService.unlikeComment(userId, comId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('status/comment/:comId')
    async checkCommentStatus(
        @Param('comId') comId: number,
        @Req() req: Request,
    ) {
        const userId = req.user['sub'];
        return this.likeService.checkCommentLikeStatus(userId, comId);
    }
}
