import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { deleteFileIfExists } from '../utils/file.helper';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    private readonly baseImageUrl = 'http://localhost:3000/src/img/';

    @UseGuards(JwtAuthGuard)
    @Get('/profile/:slug')
    async getProfileOthers(@Param('slug') slug: string) {
        return await this.userService.getProfileBySlug(slug);
    }

    @Get('friend-search')
    async searchUsers(
        @Query('query') query: string,
        @Query('order') order: 'followerCount' | 'createdAt' = 'followerCount',
        @Query('limit') limit: number = 5,
        @Query('offset') offset: number = 0,
    ): Promise<User[]> {
        return this.userService.searchUsers(query, order, limit, offset);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    async getMyProfile(@Req() req: Request) {
        const userId = req.user['sub'];
        return await this.userService.getProfile(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/friend-profile')
    async friendProfile(@Req() req: Request) {
        const userId = req.user['sub'];
        return await this.userService.profileFriend(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('profile/upload-image')
    @UseInterceptors(FileInterceptor('profileImage'))
    async uploadProfileImage(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.handleImageUpload(file, req, res, 'profileImage');
    }

    @UseGuards(JwtAuthGuard)
    @Post('profile/banner-image')
    @UseInterceptors(FileInterceptor('banner'))
    async uploadBannerImage(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.handleImageUpload(file, req, res, 'bannerImage');
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/update-profile')
    async updateProfile(
        @Req() req: Request,
        @Body() updateProfileDto: { name: string; bio: string },
    ) {
        const userId = req.user['sub'];
        const updatedUser = await this.userService.updateProfile(
            userId,
            updateProfileDto,
        );
        return updatedUser;
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/update-profile/private')
    async updatePrivate(@Req() req: Request) {
        const userId = req.user['sub'];
        const updatedUser = await this.userService.updatePrivate(userId);
        return updatedUser;
    }

    @UseGuards(JwtAuthGuard)
    @Delete('profile/delete-image')
    async deleteProfileImage(@Req() req: Request, @Res() res: Response) {
        const userId = req.user['sub'];
        const user = await this.userService.findUserById(userId);

        if (!user.profileImage) {
            return res.status(400).json({ error: 'Profil resmi bulunamadı.' });
        }

        deleteFileIfExists(user.profileImage, this.baseImageUrl);

        await this.userService.updateProfileImage(userId, null);
        return res.json({ message: 'Profil resmi başarıyla silindi.' });
    }

    @UseGuards(JwtAuthGuard)
    @Delete('profile/delete')
    async deleteUser(@Req() req: Request, @Body('password') password: string) {
        try {
            const userId = req.user['sub'];
            console.log('Silinen kullanıcı ID:', userId);

            const user = await this.userService.findUserByPassword(userId);
            if (!user) {
                console.error('Kullanıcı bulunamadı!');
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            console.log(user); //

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password,
            );
            console.log(isPasswordValid);
            if (!isPasswordValid) {
                console.error('Yanlış şifre girildi!');
                throw new HttpException(
                    'Incorrect password',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            await this.userService.deleteUser(userId);
            return { message: 'User deleted successfully' };
        } catch (error) {
            console.error('Kullanıcı silme hatası:', error);
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private async handleImageUpload(
        file: Express.Multer.File,
        req: Request,
        res: Response,
        field: 'profileImage' | 'bannerImage',
    ) {
        if (!file) {
            return res.status(400).json({
                error: 'Resim yüklenemedi, lütfen geçerli bir dosya seçin.',
            });
        }

        const userId = req.user['sub'];
        const newImagePath = `${this.baseImageUrl}${file.filename}`;

        const user = await this.userService.findById(userId);
        const oldImagePath = user[field];

        if (oldImagePath) {
            deleteFileIfExists(oldImagePath, this.baseImageUrl);
        }

        await this.userService.updateImage(userId, newImagePath, field);

        return res.json({
            message: `${field === 'profileImage' ? 'Profil' : 'Banner'} resmi başarıyla güncellendi.`,
            imageUrl: newImagePath,
        });
    }
}
