import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    NotFoundException,
    Req,
    UseGuards,
    Post,
    BadRequestException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from './message.entity';
import { ChatRoom } from './chat-room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Follower } from 'src/follower/follower.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,

        @InjectRepository(Follower)
        private readonly followerRepository: Repository<Follower>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    @Get('messages/:chatRoomId')
    async getMessages(
        @Param('chatRoomId', ParseIntPipe) chatRoomId: number,
    ): Promise<Message[]> {
        const messages = await this.chatService.getMessagesByRoomId(chatRoomId);
        return messages;
    }

    @Get('userRooms/:id')
    async getUserRooms(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ChatRoom[]> {
        const rooms = await this.chatService.getUserRooms(id);
        return rooms;
    }

    @Post('create-room/:userId')
    @UseGuards(JwtAuthGuard)
    async createRoom(
        @Param('userId', ParseIntPipe) userId: number,
        @Req() req: Request,
    ): Promise<ChatRoom> {
        const currentUserId = req.user['sub'];

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) throw new NotFoundException('Kullanıcı bulunamadı');

        const mutualFollowExists = await this.followerRepository
            .createQueryBuilder('follower')
            .where('follower.followerId = :currentUserId', { currentUserId })
            .andWhere('follower.followingId = :userId', { userId })
            .andWhere('follower.status = :status', { status: 'accepted' })
            .andWhere((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('1')
                    .from(Follower, 'subFollower')
                    .where('subFollower.followerId = :userId')
                    .andWhere('subFollower.followingId = :currentUserId')
                    .andWhere('subFollower.status = :status')
                    .getQuery();
                return `EXISTS ${subQuery}`;
            })
            .setParameter('status', 'accepted')
            .getOne();

        if (!mutualFollowExists) {
            throw new BadRequestException(
                'Kullanıcılar karşılıklı arkadaş değil.',
            );
        }

        const existingRoom = await this.chatService.findExistingRoom(
            currentUserId,
            userId,
        );
        if (existingRoom) return existingRoom;

        return this.chatService.createRoom(currentUserId, userId);
    }

    @Get('new/friends')
    @UseGuards(JwtAuthGuard)
    async getAllFriends(@Req() req: Request): Promise<User[]> {
        const userId = req.user['sub'];

        const mutualFriends = await this.followerRepository
            .createQueryBuilder('follower')
            .innerJoinAndSelect('follower.following', 'followingUser')
            .where('follower.followerId = :userId', { userId })
            .andWhere('follower.status = :status', { status: 'accepted' })
            .andWhere((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('1')
                    .from(Follower, 'subFollower')
                    .where('subFollower.followerId = followingUser.id')
                    .andWhere('subFollower.followingId = :userId')
                    .andWhere('subFollower.status = :status')
                    .getQuery();
                return `EXISTS ${subQuery}`;
            })
            .setParameter('status', 'accepted')
            .getMany();

        return mutualFriends.map((f) => f.following);
    }
}
