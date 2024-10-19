import {
    Controller,
    Delete,
    Get,
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
        return this.likeService.likePost(userId, postId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('remove/post/:postId')
    async removePostLike(@Param('postId') postId: number, @Req() req: Request) {
        const userId = req.user['sub'];
        return this.likeService.unlikePost(userId, postId);
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
