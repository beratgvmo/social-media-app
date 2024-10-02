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
    UseInterceptors,
    UploadedFile,
    Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { error } from 'console';
import { unlinkSync } from 'fs';

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

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    async getProfile(@Req() req: Request) {
        const userId = req.user['sub'];
        const userProfile = await this.authService.getProfile(userId);
        return {
            id: userProfile.id,
            email: userProfile.email,
            name: userProfile.name,
            profileImage: userProfile.profileImage,
        };
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

    @UseGuards(JwtAuthGuard)
    @Post('uploadImage')
    @UseInterceptors(FileInterceptor('profileImage'))
    async uploadProfileImage(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        if (!file) {
            return res.status(400).send({
                error: 'Resim yüklenemedi, lütfen geçerli bir dosya seçin.',
            });
        }

        const userId = req.user['sub'];
        const imagePath = `http://localhost:3000/src/img/${file.filename}`;

        await this.authService.updateProfileImage(userId, imagePath);

        return res.send({
            message: 'Profil resmi başarıyla yüklendi.',
            imageUrl: imagePath,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Delete('deleteImage')
    async deleteProfileImage(@Req() req: Request, @Res() res: Response) {
        const userId = req.user['sub'];
        const user = await this.authService.findUserById(userId);

        if (!user.profileImage) {
            return res.status(400).json({ error: 'Profil resmi bulunamadı.' });
        }

        try {
            const filePath = join(
                process.cwd(),
                'src/img',
                user.profileImage.split('/').pop(),
            );
            unlinkSync(filePath);
        } catch (error) {
            return res
                .status(500)
                .json({ error: 'Dosya silinirken hata oluştu.' });
        }

        await this.authService.updateProfileImage(userId, null);
        return res.json({ message: 'Profil resmi başarıyla silindi.' });
    }
}
