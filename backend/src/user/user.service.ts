import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like as ILike, In } from 'typeorm';
import { User } from './user.entity';
import { Like } from 'src/like/like.entity';
import { Post } from 'src/post/post.entity';
import { Comment } from 'src/comment/comment.entity';
import { Message } from 'src/chat/message.entity';
import { Follower } from 'src/follower/follower.entity';
import { ChatRoom } from 'src/chat/chat-room.entity';
import { FriendProfileDto } from './dto/friend-profile.dto';
import { PostImage } from 'src/post-images/post-images.entity';
import { PostSaved } from 'src/post-saved/post-saved.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Like)
        private readonly likeRepository: Repository<Like>,

        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

        @InjectRepository(PostSaved)
        private readonly postSavedRepository: Repository<PostSaved>,

        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,

        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,

        @InjectRepository(Follower)
        private readonly followerRepository: Repository<Follower>,

        @InjectRepository(ChatRoom)
        private readonly chatRoomRepository: Repository<ChatRoom>,

        @InjectRepository(PostImage)
        private readonly postImageRepository: Repository<PostImage>,
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

    async findUserByPassword(userId: number) {
        return this.userRepository.findOne({
            where: { id: userId },
            select: ['id', 'password'],
        });
    }

    async removeUserRelations(userId: number): Promise<void> {
        const userPosts = await this.postRepository.find({
            where: { user: { id: userId } },
            select: ['id'],
        });

        const postIds = userPosts.map((post) => post.id);

        const userComments = await this.commentRepository.find({
            where: { user: { id: userId } },
            select: ['id'],
        });

        const commentIds = userComments.map((comment) => comment.id);

        if (postIds.length > 0) {
            await this.likeRepository.delete({ post: In(postIds) });
        }
        if (commentIds.length > 0) {
            await this.likeRepository.delete({ comment: In(commentIds) });
        }

        if (postIds.length > 0) {
            await this.commentRepository.delete({ post: In(postIds) });
        }

        if (commentIds.length > 0) {
            await this.commentRepository.delete({ id: In(commentIds) });
        }

        if (postIds.length > 0) {
            await this.postSavedRepository.delete({ post: In(postIds) });
        }

        if (postIds.length > 0) {
            await this.postImageRepository.delete({ post: In(postIds) });
        }

        if (postIds.length > 0) {
            await this.postRepository.delete({ id: In(postIds) });
        }

        await this.likeRepository.delete({ user: { id: userId } });

        await this.messageRepository.delete({ sender: { id: userId } });
        await this.chatRoomRepository.delete({ user1: { id: userId } });
        await this.chatRoomRepository.delete({ user2: { id: userId } });

        // Decrement follower and following counts
        const followers = await this.followerRepository.find({
            where: { following: { id: userId } },
            relations: ['follower'],
        });
        for (const follower of followers) {
            await this.userRepository.decrement(
                { id: follower.follower.id },
                'followingCount',
                1,
            );
        }

        const following = await this.followerRepository.find({
            where: { follower: { id: userId } },
            relations: ['following'],
        });
        for (const follow of following) {
            await this.userRepository.decrement(
                { id: follow.following.id },
                'followerCount',
                1,
            );
        }

        await this.followerRepository.delete({ following: { id: userId } });
        await this.followerRepository.delete({ follower: { id: userId } });
    }

    async deleteUser(userId: number) {
        await this.removeUserRelations(userId);
        await this.userRepository.delete(userId);
    }

    async getProfile(userId: number): Promise<{
        id: number;
        name: string;
        email: string;
        bio: string;
        slug: string;
        isPrivate: boolean;
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
            isPrivate: user.isPrivate,
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
        const newUser = await this.userRepository.save(user);

        return {
            user: newUser,
        };
    }

    async updatePrivate(userId: number): Promise<void> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.isPrivate = !user.isPrivate;
        await this.userRepository.save(user);
    }

    async profileFriend(userId: number): Promise<FriendProfileDto[]> {
        return await this.userRepository
            .createQueryBuilder('user')
            .select([
                'user.id',
                'user.name',
                'user.profileImage',
                'user.slug',
                'user.bio',
            ])
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
            { name: ILike(`%${query}%`) },
            { slug: ILike(`%${query}%`) },
            { bio: ILike(`%${query}%`) },
        ];

        return this.userRepository.find({
            where: whereConditions,
            order: { [order]: 'DESC' },
            take: limit,
            skip: offset,
        });
    }
}
