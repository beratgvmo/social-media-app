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
} from '@nestjs/common';
import { FollowerService } from './follower.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('follower')
export class FollowerController {
    constructor(private readonly followerService: FollowerService) {}

    @UseGuards(JwtAuthGuard)
    @Post('follow/:userId')
    async follow(@Param('userId') userId: number, @Req() req: Request) {
        const followerId = req.user['sub'];
        await this.followerService.follow(followerId, userId);
        return { message: 'Takip isteği gönderildi.' };
    }

    @UseGuards(JwtAuthGuard)
    @Delete('unfollow/:userId')
    async unfollow(@Param('userId') userId: number, @Req() req: Request) {
        const followerId = req.user['sub'];
        await this.followerService.unfollow(followerId, userId);
        return { message: 'Takipten çıkarıldı.' };
    }

    @Post(':followerId/respond')
    async respondToFollowRequest(
        @Param('followerId') followerId: number,
        @Body('isAccepted') isAccepted: boolean,
    ) {
        return this.followerService.respondToFollowRequest(
            followerId,
            isAccepted,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get('status/:userId')
    async checkFollowingStatus(
        @Param('userId') userId: number,
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

    @Post('read/:followId')
    async markAsRead(@Param('followId') followId: number) {
        return this.followerService.markAsRead(followId);
    }

    @Get('following-all/:userId')
    async userFollowingAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Param('userId') userId: number,
    ) {
        return await this.followerService.userFollowingAll(userId, page, limit);
    }

    @Get('follower-all/:userId')
    async userFollowerAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Param('userId') userId: number,
    ) {
        return await this.followerService.userFollowerAll(userId, page, limit);
    }
}
