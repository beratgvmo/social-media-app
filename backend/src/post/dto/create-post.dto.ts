import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @MinLength(3)
    content: string;
}
