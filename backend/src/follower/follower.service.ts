import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
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

    async follow(followerId: number, followingId: number): Promise<void> {
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

        let newFollowStatus: 'pending' | 'accepted' = 'pending';
        if (!following.isPrivate) {
            newFollowStatus = 'accepted';
        }

        const newFollow = this.followerRepository.create({
            follower: follower,
            following: following,
            status: newFollowStatus,
        });

        await this.followerRepository.save(newFollow);

        if (!following.isPrivate) {
            follower.followingCount += 1;
            following.followerCount += 1;
            await this.userRepository.save(follower);
            await this.userRepository.save(following);
        }
    }

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

        await this.followerRepository.remove(followRecord);

        if (followRecord.status === 'accepted') {
            follower.followingCount -= 1;
            following.followerCount -= 1;
            await this.userRepository.save(follower);
            await this.userRepository.save(following);
        }
    }

    async respondToFollowRequest(
        followerId: number,
        isAccepted: boolean,
    ): Promise<void> {
        const followRequest = await this.followerRepository
            .createQueryBuilder('follower')
            .where('follower.followerId = :followerId', { followerId })
            .andWhere('follower.status = :status', { status: 'pending' })
            .getOne();

        if (!followRequest) {
            throw new NotFoundException('Takip isteği bulunamadı');
        }

        if (isAccepted) {
            followRequest.status = 'accepted';
            await this.followerRepository.save(followRequest);
        } else {
            await this.followerRepository.remove(followRequest);
        }
    }

    async isFollowing(
        followerId: number,
        followingId: number,
    ): Promise<string | null> {
        const followRecord = await this.followerRepository
            .createQueryBuilder('follower')
            .where('follower.followerId = :followerId', { followerId })
            .andWhere('follower.followingId = :followingId', { followingId })
            .getOne();

        if (followRecord) {
            return followRecord.status;
        }
        return null;
    }

    async getPendingFollowRequests(userId: number): Promise<Follower[]> {
        const followRequests = await this.followerRepository
            .createQueryBuilder('follower')
            .leftJoinAndSelect('follower.follower', 'followerUser')
            .where('follower.followingId = :userId', { userId })
            .andWhere('follower.status = :status', { status: 'pending' })
            .getMany();

        return followRequests.map((follow) => follow);
    }
}
