import { IsString, MinLength } from 'class-validator';

export class UpdatePost {
    @IsString()
    @MinLength(3)
    text: string;
}
