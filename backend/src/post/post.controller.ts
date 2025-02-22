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
    Put,
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
        if (!createPostDto.content) {
            throw new BadRequestException('İçerik zorunludur.');
        }

        const userId = req.user['sub'];
        const imageUrls = files.map(
            (file) => `http://localhost:3000/${file.path}`,
        );

        const post = await this.postService.createPost(
            createPostDto.content,
            createPostDto.codeContent,
            createPostDto.codeLanguage,
            createPostDto.codeTheme,
            createPostDto.githubApiUrl,
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
    @Put('/edit/:postId')
    @UseInterceptors(FilesInterceptor('images', 4))
    async editPost(
        @Param('postId') postId: number,
        @Body() updatePostDto: CreatePostDto,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: Request,
    ) {
        if (!updatePostDto.content) {
            throw new BadRequestException('İçerik zorunludur.');
        }

        const userId = req.user['sub'];
        const imageUrls = files.map(
            (file) => `http://localhost:3000/${file.path}`,
        );

        const updatedPost = await this.postService.updatePost(
            postId,
            updatePostDto.content,
            updatePostDto.codeContent,
            updatePostDto.codeLanguage,
            updatePostDto.codeTheme,
            updatePostDto.githubApiUrl,
            updatePostDto.githubType,
            imageUrls,
            userId,
        );

        return {
            message: 'Post başarıyla güncellendi.',
            post: updatedPost,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':postId')
    async deletePost(@Param('postId') postId: number, @Req() req: Request) {
        const userId = req.user['sub'];
        await this.postService.deletePost(postId, userId);

        return {
            message: 'Post başarıyla silindi.',
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllHome(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Req() req: Request,
    ): Promise<PostEntity[]> {
        const userId = req.user['sub'];

        return this.postService.findAllPosts(page, limit, userId);
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

    @UseGuards(JwtAuthGuard)
    @Get('/:slug/:postId')
    async getPost(
        @Param('postId') postId: number,
        @Param('slug') slug: string,
    ) {
        return this.postService.findPostByIdAndSlug(postId, slug);
    }
}
