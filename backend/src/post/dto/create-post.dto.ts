import { IsString, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { PostType } from '../post.entity';

export class CreatePostDto {
    @IsString()
    @MaxLength(10000, { message: 'İçerik en fazla 5000 karakter olabilir.' })
    content: string;

    @IsEnum(PostType)
    postType: PostType;

    @IsOptional()
    images?: Express.Multer.File[];
}
