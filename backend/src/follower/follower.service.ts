import {
    BadRequestException,
    ConflictException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Follower, FollowStatus } from './follower.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Notification } from 'src/notification/notification.entity';
import { NotificationGateway } from 'src/notification/notification.gateway';
// import { FollowerGateway } from './follower.gateway';

@Injectable()
export class FollowerService {
    constructor(
        @InjectRepository(Follower)
        private followerRepository: Repository<Follower>,

        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,

        @InjectRepository(User)
        private userRepository: Repository<User>,

        private readonly notificationGateway: NotificationGateway,

        // private followerGateway: FollowerGateway,
    ) {}

    async follow(followerId: number, followingId: number): Promise<void> {
        if (followerId === followingId) {
            throw new BadRequestException('Kendi kendinizi takip edemezsiniz.');
        }

        const [follower, following] = await Promise.all([
            this.userRepository.findOne({ where: { id: followerId } }),
            this.userRepository.findOne({ where: { id: followingId } }),
        ]);

        if (!follower || !following) {
            throw new NotFoundException(
                'Takip edilecek veya takip eden kullanıcı bulunamadı.',
            );
        }

        const existingFollow = await this.followerRepository.findOne({
            where: {
                follower: { id: followerId },
                following: { id: followingId },
            },
        });

        if (existingFollow) {
            throw new ConflictException(
                'Bu kullanıcıyı zaten takip ediyorsunuz.',
            );
        }

        const newFollowStatus = following.isPrivate
            ? FollowStatus.PENDING
            : FollowStatus.ACCEPTED;

        const newFollow = this.followerRepository.create({
            follower,
            following,
            status: newFollowStatus,
        });

        await this.followerRepository.save(newFollow);
        // this.followerGateway.handleMessage(null, followingId);

        if (newFollowStatus === FollowStatus.PENDING) {
            const notification = this.notificationRepository.create({
                fromUser: follower,
                type: 'follow',
                user: following,
            });

            await this.notificationRepository.save(notification);

            this.notificationGateway.handleMessage(null, following.id);
        }

        if (newFollowStatus === FollowStatus.ACCEPTED) {
            follower.followingCount++;
            following.followerCount++;
            await this.userRepository.save([follower, following]);
        }
    }

    async removeFollower(userId: number, followerId: number): Promise<void> {
        const follow = await this.followerRepository.findOne({
            where: {
                follower: { id: followerId },
                following: { id: userId },
            },
        });

        if (!follow) {
            throw new NotFoundException('Bu kullanıcı seni takip etmiyor.');
        }

        await this.followerRepository.delete({ id: follow.id });

        await this.notificationRepository.delete({
            user: { id: userId },
            fromUser: { id: followerId },
        });

        this.notificationGateway.handleMessage(null, userId);
        // this.followerGateway.handleMessage(null, userId);

        if (follow.status === FollowStatus.ACCEPTED) {
            await Promise.all([
                this.userRepository.increment(
                    { id: followerId },
                    'followingCount',
                    -1,
                ),
                this.userRepository.increment(
                    { id: userId },
                    'followerCount',
                    -1,
                ),
            ]);
        }
    }

    async unfollow(followerId: number, followingId: number): Promise<void> {
        const follow = await this.followerRepository.findOne({
            where: {
                follower: { id: followerId },
                following: { id: followingId },
            },
        });

        if (!follow) {
            throw new NotFoundException('Bu kullanıcıyı takip etmiyorsunuz.');
        }

        await this.followerRepository.delete({ id: follow.id });

        await this.notificationRepository.delete({
            user: { id: followingId },
            fromUser: { id: followerId },
        });

        this.notificationGateway.handleMessage(null, followingId);
        // this.followerGateway.handleMessage(null, followingId);

        if (follow.status === FollowStatus.ACCEPTED) {
            await Promise.all([
                this.userRepository.increment(
                    { id: followerId },
                    'followingCount',
                    -1,
                ),
                this.userRepository.increment(
                    { id: followingId },
                    'followerCount',
                    -1,
                ),
            ]);
        }
    }

    async getUnreadFollowerCount(userId: number): Promise<number> {
        const count = await this.followerRepository.count({
            where: {
                following: { id: userId },
                isRead: false,
            },
        });
        return count;
    }

    async acceptFollowRequest(
        followerId: number,
        userId: number,
        isAccepted: boolean,
    ): Promise<void> {
        const followRequest = await this.followerRepository.findOne({
            where: {
                follower: { id: followerId },
                following: { id: userId },
                status: FollowStatus.PENDING,
            },
            relations: ['follower', 'following'],
        });

        if (!followRequest) {
            throw new NotFoundException('Takip isteği bulunamadı.');
        }

        const notification = await this.notificationRepository.findOne({
            where: { user: { id: userId }, fromUser: { id: followerId } },
        });

        if (notification) {
            await this.notificationRepository.update(notification.id, {
                isRead: true,
            });
        }

        this.notificationGateway.handleMessage(null, followerId);
        // this.followerGateway.handleMessage(null, followerId);

        if (isAccepted) {
            followRequest.status = FollowStatus.ACCEPTED;
            await this.followerRepository.save(followRequest);

            await this.userRepository.increment(
                { id: userId },
                'followerCount',
                1,
            );
            await this.userRepository.increment(
                { id: followerId },
                'followingCount',
                1,
            );
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

    async markAsRead(id: number): Promise<void> {
        await this.followerRepository.update(id, {
            isRead: true,
        });
    }

    async userFollowingAll(
        userId: number,
        page: number,
        limit: number,
    ): Promise<object> {
        const skip = (page - 1) * limit;

        const [followings] = await this.followerRepository.findAndCount({
            where: { follower: { id: userId }, status: FollowStatus.ACCEPTED },
            relations: ['following'],
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        return {
            followings: followings.map((f) => this.filterUser(f.following)),
        };
    }

    async userFollowerAll(
        userId: number,
        page: number,
        limit: number,
    ): Promise<object> {
        const skip = (page - 1) * limit;

        const [followers] = await this.followerRepository.findAndCount({
            where: { following: { id: userId }, status: FollowStatus.ACCEPTED },
            relations: ['follower'],
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        return {
            followers: followers.map((f) => this.filterUser(f.follower)),
        };
    }

    private filterUser(user: User) {
        if (!user) {
            return null;
        }
        return {
            id: user.id,
            name: user.name,
            bio: user.bio,
            profileImage: user.profileImage,
            slug: user.slug,
        };
    }
}
