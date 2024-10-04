import {
    Controller,
    Post,
    Delete,
    Param,
    UseGuards,
    Get,
    Req,
    Res,
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
    async follow(@Param('userId') userId: number, @Req() req: Request) {
        const followerId = req.user['sub'];

        await this.followerService.follow(followerId, userId);

        return {
            message: 'Başarılı',
        };
    }

    @UseGuards(JwtAuthGuard)
    @Delete('unfollow/:userId')
    async unfollow(@Param('userId') userId: number, @Req() req: Request) {
        const followerId = req.user['sub'];

        await this.followerService.unfollow(followerId, userId);

        return {
            message: 'Başarılı',
        };
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
}
