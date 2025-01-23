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

    async register(registerDto: RegisterDto, res: Response): Promise<void> {
        const existingUser = await this.userRepository.findOne({
            where: { email: registerDto.email },
        });

        if (existingUser) {
            throw new HttpException(
                'Email zaten kullanımda.',
                HttpStatus.BAD_REQUEST,
            );
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = this.userRepository.create({
            ...registerDto,
            password: hashedPassword,
        });
        await this.userRepository.save(user);

        this.issueTokens(user, res);
    }

    async login(email: string, password: string, res: Response): Promise<void> {
        const user = await this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'name', 'password'],
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new HttpException(
                'Geçersiz giriş bilgileri.',
                HttpStatus.UNAUTHORIZED,
            );
        }

        this.issueTokens(user, res);
    }

    async refreshToken(refreshToken: string, res: Response): Promise<void> {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });

            const user = await this.userRepository.findOne({
                where: { id: payload.sub },
            });
            if (!user) {
                throw new HttpException(
                    'Kullanıcı bulunamadı.',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            this.issueTokens(user, res);
        } catch {
            throw new HttpException(
                'Geçersiz yenileme token.',
                HttpStatus.UNAUTHORIZED,
            );
        }
    }

    private issueTokens(user: User, res: Response): void {
        const payload = { sub: user.id };

        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '15m',
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(HttpStatus.OK).send({
            message: 'Giriş başarılı.',
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }
}
