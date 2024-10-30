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
import { NotificationService } from '../notification/notification.service';

@Controller('like')
export class LikeController {
    constructor(
        private readonly likeService: LikeService,
        private readonly notificationService: NotificationService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('post/:postId')
    async postLike(@Param('postId') postId: number, @Req() req: Request) {
        const userId = req.user['sub'];

        const likedPost = await this.likeService.likePost(userId, postId);

        const postOwner = likedPost.user;

        if (userId != postOwner.id) {
            await this.notificationService.createNotification(
                postOwner,
                'like',
                userId,
                likedPost,
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('remove/post/:postId')
    async removePostLike(@Param('postId') postId: number, @Req() req: Request) {
        const userId = req.user['sub'];

        const updatedLikeCount = await this.likeService.unlikePost(
            userId,
            postId,
        );

        const postOwner = updatedLikeCount.user.id;

        if (userId != postOwner) {
            await this.notificationService.removeNotification(
                userId,
                postId,
                postOwner,
                'like',
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
