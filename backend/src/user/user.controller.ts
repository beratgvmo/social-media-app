import {
    Controller,
    Delete,
    Get,
    Post,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { unlinkSync } from 'fs';
import { join } from 'path';
import { Request, Response } from 'express';
import { FriendProfileDto } from './dto/friend-profile.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    async getProfile(@Req() req: Request) {
        const userId = req.user['sub'];
        const userProfile = await this.userService.getProfile(userId);
        return {
            id: userProfile.id,
            email: userProfile.email,
            name: userProfile.name,
            profileImage: userProfile.profileImage,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    async getProfile(@Req() req: Request) {
        const userId = req.user['sub'];
        const userProfile = await this.userService.getProfile(userId);
        return {
            id: userProfile.id,
            email: userProfile.email,
            name: userProfile.name,
            profileImage: userProfile.profileImage,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('/friend-profile')
    async friendProfile(@Req() req: Request) {
        const userId = req.user['sub'];
        return this.userService.profileFriend(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload-image')
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

        await this.userService.updateProfileImage(userId, imagePath);

        return res.send({
            message: 'Profil resmi başarıyla yüklendi.',
            imageUrl: imagePath,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete-image')
    async deleteProfileImage(@Req() req: Request, @Res() res: Response) {
        const userId = req.user['sub'];
        const user = await this.userService.findUserById(userId);

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

        await this.userService.updateProfileImage(userId, null);
        return res.json({ message: 'Profil resmi başarıyla silindi.' });
    }
}
