import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}
