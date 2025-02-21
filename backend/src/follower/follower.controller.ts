import {
    Controller,
    Post,
    Delete,
    Param,
    UseGuards,
    Get,
    Req,
    Body,
    Query,
    ParseIntPipe,
} from '@nestjs/common';
import { FollowerService } from './follower.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('follower')
export class FollowerController {
    constructor(private readonly followerService: FollowerService) {}

    @UseGuards(JwtAuthGuard)
    @Post('follow/:userId')
    async follow(
        @Param('userId', ParseIntPipe) userId: number,
        @Req() req: Request,
    ) {
        const followerId = req.user['sub'];
        await this.followerService.follow(followerId, userId);
        return { message: 'Takip isteği gönderildi.' };
    }

    @UseGuards(JwtAuthGuard)
    @Delete('unfollow/:userId')
    async unfollow(
        @Param('userId', ParseIntPipe) userId: number,
        @Req() req: Request,
    ) {
        const followerId = req.user['sub'];
        await this.followerService.unfollow(followerId, userId);
        return { message: 'Takipten çıkarıldı.' };
    }

    @UseGuards(JwtAuthGuard)
    @Delete('remove-follower/:followerId')
    async removeFollower(
        @Param('followerId', ParseIntPipe) followerId: number,
        @Req() req: Request,
    ) {
        const userId = req.user['sub'];
        await this.followerService.removeFollower(userId, followerId);
        return { message: 'Takipçi kaldırıldı.' };
    }

    @UseGuards(JwtAuthGuard)
    @Post(':followerId/accept')
    async respondToFollowRequest(
        @Param('followerId', ParseIntPipe) followerId: number,
        @Body('isAccepted') isAccepted: boolean,
        @Req() req: Request,
    ) {
        const userId = req.user['sub'];
        return this.followerService.acceptFollowRequest(
            followerId,
            userId,
            isAccepted,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get('status/:userId')
    async checkFollowingStatus(
        @Param('userId', ParseIntPipe) userId: number,
        @Req() req: Request,
    ) {
        const followerId = req.user['sub'];
        const isFollowing = await this.followerService.isFollowing(
            followerId,
            userId,
        );
        return { isFollowing };
    }

    @UseGuards(JwtAuthGuard)
    @Get('pending-requests')
    async getPendingFollowRequests(@Req() req: Request) {
        const userId = req.user['sub'];
        return this.followerService.getPendingFollowRequests(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('read/:followId')
    async markAsRead(@Param('followId', ParseIntPipe) followId: number) {
        return this.followerService.markAsRead(followId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('following-all/:userId')
    async userFollowingAll(
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
        @Param('userId', ParseIntPipe) userId: number,
    ) {
        return await this.followerService.userFollowingAll(userId, page, limit);
    }

    @UseGuards(JwtAuthGuard)
    @Get('follower-all/:userId')
    async userFollowerAll(
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
        @Param('userId', ParseIntPipe) userId: number,
    ) {
        return await this.followerService.userFollowerAll(userId, page, limit);
    }
}
