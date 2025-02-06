import { IsString, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { GithubType, PostType } from '../post.entity';

export class CreatePostDto {
    @IsString()
    @MaxLength(10000, { message: 'İçerik en fazla 5000 karakter olabilir.' })
    content: string;

    @IsEnum(PostType)
    postType: PostType;

    @IsEnum(GithubType)
    @IsOptional()
    githubType?: GithubType;

    @IsString()
    @IsOptional()
    githubApiUrl?: string;

    @IsOptional()
    images?: Express.Multer.File[];
}
