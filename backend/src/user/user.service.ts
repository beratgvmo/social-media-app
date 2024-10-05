import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { FriendProfileDto } from './dto/friend-profile.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async updateProfileImage(userId: number, imagePath: string | null) {
        await this.userRepository.update(userId, { profileImage: imagePath });
    }

    async findUserById(id: number): Promise<User> {
        return await this.userRepository.findOne({ where: { id } });
    }

    async getProfile(userId: number): Promise<{
        id: number;
        name: string;
        email: string;
        slug: string;
        profileImage: string | null;
    }> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('Kullanıcı bulunamadı');
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            slug: user.slug,
            profileImage: user.profileImage,
        };
    }

    async profileFriend(userId: number): Promise<FriendProfileDto[]> {
        return await this.userRepository
            .createQueryBuilder('user')
            .select(['user.id', 'user.name', 'user.profileImage', 'user.slug'])
            .where('user.id != :userId', { userId })
            .limit(10)
            .getMany();
    }

    async getProfileBySlug(slug: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { slug } });
        if (!user) {
            throw new NotFoundException('Kullanıcı bulunamadı');
        }
        return user;
    }
}
