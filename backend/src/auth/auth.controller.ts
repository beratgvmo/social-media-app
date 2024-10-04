import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Res,
    Req,
    HttpStatus,
    HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
        return await this.authService.register(registerDto, res);
    }

    @Post('/login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        return await this.authService.login(
            loginDto.email,
            loginDto.password,
            res,
        );
    }

    @Post('/logout')
    async logout(@Res() res: Response) {
        return await this.authService.logout(res);
    }

    @Post('/refresh')
    @HttpCode(HttpStatus.OK)
    async refreshToken(
        @Body('refreshToken') refreshToken: string,
        @Res() res: Response,
    ) {
        return await this.authService.refreshToken(refreshToken, res);
    }
}
