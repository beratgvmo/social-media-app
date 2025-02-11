import { IsString, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { CodeTheme, GithubType } from '../post.entity';

export class CreatePostDto {
    @IsString()
    @MaxLength(10000, { message: 'İçerik en fazla 10000 karakter olabilir.' })
    content: string;

    @IsEnum(CodeTheme)
    @IsOptional()
    codeTheme: CodeTheme;

    @IsString()
    @IsOptional()
    codeContent?: string;

    @IsString()
    @IsOptional()
    codeLanguage?: string;

    @IsEnum(GithubType)
    @IsOptional()
    githubType?: GithubType;

    @IsString()
    @IsOptional()
    githubApiUrl?: string;

    @IsOptional()
    images?: Express.Multer.File[];
}
