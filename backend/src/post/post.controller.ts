import {
    Controller,
    Post,
    Body,
    UseGuards,
    UseInterceptors,
    UploadedFiles,
    Req,
    Get,
    Query,
    BadRequestException,
    Param,
    Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { Post as PostEntity } from './post.entity';

@Controller('post')
export class PostController {
    constructor(private postService: PostService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    @UseInterceptors(FilesInterceptor('images', 4))
    async createPost(
        @Body() createPostDto: CreatePostDto,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: Request,
    ) {
        if (!createPostDto.content || !createPostDto.postType) {
            throw new BadRequestException('İçerik ve postType zorunludur.');
        }

        if (files.length > 4) {
            throw new BadRequestException(
                'En fazla 4 resim yükleyebilirsiniz.',
            );
        }

        const userId = req.user['sub'];
        const imageUrls: string[] = files.map(
            (file) => `http://localhost:3000/${file.path}`,
        );

        const post = await this.postService.createPost(
            createPostDto.content,
            createPostDto.postType,
            createPostDto?.githubApiUrl,
            createPostDto.githubType,
            imageUrls,
            userId,
        );

        return {
            message: 'Post başarıyla oluşturuldu.',
            post,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete/:postId')
    async deletePost(@Param('postId') postId: number, @Req() req: Request) {
        const userId = req.user['sub'];
        await this.postService.deletePost(postId, userId);

        return {
            message: 'Post başarıyla silindi.',
        };
    }

    @Get()
    async getAllHome(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<PostEntity[]> {
        return this.postService.findAllPosts(page, limit);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userSlug')
    async getProfilPost(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Param('userSlug') userSlug: string,
    ) {
        return this.postService.findProfilPosts(page, limit, userSlug);
    }
}
