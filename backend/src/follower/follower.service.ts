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

    async follow(followerId: number, followingId: number): Promise<Follower> {
        const follower = await this.userRepository.findOne({
            where: { id: followerId },
        });
        const following = await this.userRepository.findOne({
            where: { id: followingId },
        });

        console.log(follower);
        console.log(following);

        if (!follower || !following) {
            throw new NotFoundException('Kullanıcı bulunamadı');
        }

        if (follower.id === following.id) {
            throw new Error('Kullanıcı aynı');
        }

        // Kullanıcının zaten takip edip etmediğini kontrol etme
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

        const newFollow = this.followerRepository.create({
            follower,
            following,
        });

        return this.followerRepository.save(newFollow);
    }

    // Takipten çıkma işlemi
    async unfollow(followerId: number, followingId: number): Promise<void> {
        // Takipçi ve takip edilen kullanıcıyı buluyoruz
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

        console.log(follower);

        if (!followRecord) {
            throw new NotFoundException('Takip kaydı bulunamadı');
        }

        await this.followerRepository.remove(followRecord);
    }

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
