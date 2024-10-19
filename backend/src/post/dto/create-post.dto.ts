import { IsArray, IsString, MinLength, ArrayMaxSize } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @MinLength(3)
    content: string;
}
