import { Injectable, NotFoundException } from '@nestjs/common';
import { Follower } from './follower.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class FollowerService {
    constructor(
        @InjectRepository(Follower)
        private followerRepository: Repository<Follower>,

        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    // Takip etme işlemi
    async follow(followerId: number, followingId: number): Promise<Follower> {
        const follower = await this.userRepository.findOne({
            where: { id: followerId },
        });
        const following = await this.userRepository.findOne({
            where: { id: followingId },
        });

        if (!follower || !following) {
            throw new NotFoundException('Kullanıcı bulunamadı');
        }

        if (follower.id === following.id) {
            throw new Error('Kullanıcı kendini takip edemez');
        }

        const existingFollow = await this.followerRepository
            .createQueryBuilder('follower')
            .where('follower.followerId = :followerId', {
                followerId: follower.id,
            })
            .andWhere('follower.followingId = :followingId', {
                followingId: following.id,
            })
            .getOne();

        if (existingFollow) {
            throw new Error('Zaten takip ediliyor');
        }

        // Takip kaydını oluştur
        const newFollow = this.followerRepository.create({
            follower,
            following,
        });

        // Takip edilen ve takipçi sayısını güncelle
        follower.followingCount += 1;
        following.followerCount += 1;

        await this.userRepository.save(follower);
        await this.userRepository.save(following);

        return this.followerRepository.save(newFollow);
    }

    // Takibi bırakma işlemi
    async unfollow(followerId: number, followingId: number): Promise<void> {
        const follower = await this.userRepository.findOne({
            where: { id: followerId },
        });
        const following = await this.userRepository.findOne({
            where: { id: followingId },
        });

        if (!follower || !following) {
            throw new NotFoundException('Kullanıcı bulunamadı');
        }

        const followRecord = await this.followerRepository
            .createQueryBuilder('follower')
            .where('follower.followerId = :followerId', {
                followerId: follower.id,
            })
            .andWhere('follower.followingId = :followingId', {
                followingId: following.id,
            })
            .getOne();

        if (!followRecord) {
            throw new NotFoundException('Takip kaydı bulunamadı');
        }

        // Takip kaydını kaldır
        await this.followerRepository.remove(followRecord);

        // Takip edilen ve takipçi sayısını güncelle
        follower.followingCount -= 1;
        following.followerCount -= 1;

        await this.userRepository.save(follower);
        await this.userRepository.save(following);
    }

    // Kullanıcının başka bir kullanıcıyı takip edip etmediğini kontrol et
    async isFollowing(
        followerId: number,
        followingId: number,
    ): Promise<boolean> {
        const follower = await this.userRepository.findOne({
            where: { id: followerId },
        });
        const following = await this.userRepository.findOne({
            where: { id: followingId },
        });

        if (!follower || !following) {
            throw new NotFoundException('Kullanıcı bulunamadı');
        }

        const followRecord = await this.followerRepository
            .createQueryBuilder('follower')
            .where('follower.followerId = :followerId', {
                followerId: follower.id,
            })
            .andWhere('follower.followingId = :followingId', {
                followingId: following.id,
            })
            .getOne();

        return !!followRecord;
    }
}
