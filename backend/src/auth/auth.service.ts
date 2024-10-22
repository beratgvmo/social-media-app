import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto, res: Response): Promise<any> {
        const existingUser = await this.userRepository.findOne({
            where: { email: registerDto.email },
        });
        if (existingUser) {
            throw new HttpException(
                'Email already in use',
                HttpStatus.BAD_REQUEST,
            );
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = this.userRepository.create({
            ...registerDto,
            password: hashedPassword,
        });
        await this.userRepository.save(user);

        return this.issueTokens(user, res);
    }

    async login(email: string, password: string, res: Response): Promise<void> {
        const user = await this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'name', 'password'],
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new HttpException(
                'Geçersiz kimlik bilgileri',
                HttpStatus.UNAUTHORIZED,
            );
        }

        await this.issueTokens(user, res);
    }

    async refreshToken(refreshToken: string, res: Response): Promise<any> {
        const payload = this.jwtService.verify(refreshToken, {
            secret: process.env.JWT_REFRESH_SECRET,
        });
        const user = await this.userRepository.findOne({
            where: { id: payload.sub },
        });
        if (!user) {
            throw new HttpException(
                'Invalid refresh token',
                HttpStatus.UNAUTHORIZED,
            );
        }

        return this.issueTokens(user, res);
    }

    async logout(res: Response): Promise<void> {
        res.clearCookie('jwt');
        res.clearCookie('refreshToken');
        res.send({ message: 'Başarıyla çıkış yapıldı' });
    }

    private async issueTokens(user: User, res: Response) {
        const payload = { email: user.email, name: user.name, sub: user.id };

        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '15m',
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        });

        res.cookie('jwt', accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            domain: 'http://localhost:5173',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            domain: 'http://localhost:5173',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.send({
            message: 'Başarılı giriş',
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: { id: user.id, name: user.name, email: user.email },
        });
    }

    async getProfile(userId: number): Promise<{
        id: number;
        name: string;
        email: string;
        profileImage: string | null;
    }> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new HttpException(
                'Kullanıcı bulunamadı',
                HttpStatus.NOT_FOUND,
            );
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
        };
    }
}
