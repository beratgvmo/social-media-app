import {
    Controller,
    Post,
    Body,
    Res,
    Req,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
        return this.authService.register(registerDto, res);
    }

    @Post('/login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        return this.authService.login(loginDto.email, loginDto.password, res);
    }

    @Post('/logout')
    async logout(@Res() res: Response) {
        res.clearCookie('refreshToken');
        res.status(HttpStatus.OK).send({ message: 'Çıkış başarılı.' });
    }

    @Post('/refresh')
    async refreshToken(@Req() req: Request, @Res() res: Response) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new HttpException(
                'Refresh token yok.',
                HttpStatus.BAD_REQUEST,
            );
        }
        return this.authService.refreshToken(refreshToken, res);
    }
}
