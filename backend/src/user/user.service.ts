import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Like, Repository } from 'typeorm';
import { FriendProfileDto } from './dto/friend-profile.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async updateProfileImage(userId: number, imagePath: string | null) {
        await this.userRepository.update(userId, { profileImage: imagePath });
    }

    async findById(userId: number): Promise<User> {
        return this.userRepository.findOne({ where: { id: userId } });
    }

    async updateBannerImage(userId: number, imagePath: string | null) {
        await this.userRepository.update(userId, { bannerImage: imagePath });
    }

    async updateImage(
        userId: number,
        imagePath: string | null,
        field: 'profileImage' | 'bannerImage',
    ) {
        await this.userRepository.update(userId, { [field]: imagePath });
    }

    async findUserById(id: number): Promise<User> {
        return await this.userRepository.findOne({ where: { id } });
    }

    async getProfile(userId: number): Promise<{
        id: number;
        name: string;
        email: string;
        bio: string;
        slug: string;
        profileImage: string | null;
        followerCount: number;
        followingCount: number;
        bannerImage: string | null;
    }> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('Kullanıcı bulunamadı');
        }

        return {
            id: user.id,
            bio: user.bio,
            name: user.name,
            email: user.email,
            slug: user.slug,
            profileImage: user.profileImage,
            bannerImage: user.bannerImage,
            followerCount: user.followerCount,
            followingCount: user.followingCount,
        };
    }

    async updateProfile(
        userId: number,
        updateProfileDto: { name: string; bio: string },
    ): Promise<{ user: User }> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.name = updateProfileDto.name;
        user.bio = updateProfileDto.bio;
        const newuser = await this.userRepository.save(user);

        console.log(newuser);

        return {
            user: newuser,
        };
    }

    async profileFriend(userId: number): Promise<FriendProfileDto[]> {
        return await this.userRepository
            .createQueryBuilder('user')
            .select(['user.id', 'user.name', 'user.profileImage', 'user.slug'])
            .leftJoin(
                'user.followers',
                'follower',
                'follower.followerId = :userId AND (follower.status = :accepted OR follower.status = :pending)',
                { userId, accepted: 'accepted', pending: 'pending' },
            )
            .where('follower.id IS NULL')
            .andWhere('user.id != :userId', { userId })
            .limit(5)
            .getMany();
    }

    async getProfileBySlug(slug: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { slug } });

        if (!user) {
            throw new NotFoundException('Kullanıcı bulunamadı');
        }

        return user;
    }

    async searchUsers(
        query: string,
        order: 'followerCount' | 'createdAt' = 'followerCount',
        limit: number = 10,
        offset: number = 0,
    ): Promise<User[]> {
        const whereConditions = [
            { name: Like(`%${query}%`) },
            { slug: Like(`%${query}%`) },
            { bio: Like(`%${query}%`) },
        ];

        return this.userRepository.find({
            where: whereConditions,
            order: { [order]: 'DESC' },
            take: limit,
            skip: offset,
        });
    }
}
