import {
    Controller,
    Get,
    Post,
    Param,
    Res,
    Req,
    UseGuards,
    Query,
} from '@nestjs/common';
import { PostSavedService } from './post-saved.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('post-saved')
export class PostSavedController {
    constructor(private readonly postSavedService: PostSavedService) {}

    @Get('/all')
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.postSavedService.findAll(page, limit);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/:id')
    async savePost(@Req() req: Request, @Param('id') id: number) {
        const userId = req.user['sub'];

        await this.postSavedService.savePost(id, userId);

        return {
            message: 'Post saved successfully',
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('status/:id')
    async checkPostStatus(@Param('id') id: number, @Req() req: Request) {
        const userId = req.user['sub'];

        const isSaved = await this.postSavedService.checkSavePost(userId, id);

        return { status: isSaved };
    }
}
