import {
    Controller,
    Post,
    Body,
    UseGuards,
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostController {
    constructor(private postService: PostService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    @UseInterceptors(FilesInterceptor('images'))
    async createPost(
        @Body() createPostDto: CreatePostDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        const imageUrls = files.map((file) => file.filename);
        return await this.postService.createPost(
            createPostDto.content,
            imageUrls,
        );
    }
}
