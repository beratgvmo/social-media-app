import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class UpdateProfileDto {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}
