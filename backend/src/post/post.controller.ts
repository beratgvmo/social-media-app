import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request, Response } from 'express';

@Controller('post')
export class PostController {
    constructor(private postService: PostService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    createPost(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
        const userId = req.user['sub'];
        return this.postService.createPost(createPostDto, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/user-all/:id')
    userAllPost(@Param('id') id: number) {
        return this.postService.allPost(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/main')
    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    async userDelete(@Param('id') id: number, @Res() res: Response) {
        return this.postService.findOneDelete(id, res);
    }
}
