import {
    IsArray,
    IsNotEmpty,
    IsString,
    MinLength,
    IsOptional,
} from 'class-validator';

export class CreatePostDto {
    @IsString()
    @MinLength(3)
    content: string;

    @IsArray()
    @IsOptional() // Bu alan isteğe bağlı hale getirilmiştir
    @IsNotEmpty({ each: true }) // Her bir URL'nin boş olmaması gerektiğini kontrol eder
    imageUrls: string[];
}
