import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { ChatRoom } from './chat-room.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        @InjectRepository(ChatRoom)
        private chatRoomRepository: Repository<ChatRoom>,
    ) {}

    async createMessage(
        content: string,
        chatRoomId: number,
        senderId: number,
    ): Promise<Message> {
        const chatRoom = await this.chatRoomRepository.findOne({
            where: { id: chatRoomId },
        });
        if (!chatRoom) throw new NotFoundException('Chat odası bulunamadı.');

        const message = this.messageRepository.create({
            content,
            chatRoom: { id: chatRoomId },
            sender: { id: senderId },
        });
        await this.messageRepository.save(message);

        chatRoom.lastMessageDate = new Date();
        await this.chatRoomRepository.save(chatRoom);

        return message;
    }

    async getMessagesByRoomId(chatRoomId: number): Promise<Message[]> {
        const messages = await this.messageRepository.find({
            where: { chatRoom: { id: chatRoomId } },
            order: { createdAt: 'ASC' },
            relations: ['sender'],
        });

        return messages;
    }

    async createRoom(currentUserId: number, userId: number): Promise<ChatRoom> {
        const room = this.chatRoomRepository.create({
            user1: { id: currentUserId },
            user2: { id: userId },
        });

        return this.chatRoomRepository.save(room);
    }

    async getUserRooms(userId: number): Promise<ChatRoom[]> {
        const rooms = await this.chatRoomRepository.find({
            where: [{ user1: { id: userId } }, { user2: { id: userId } }],
            order: { createdAt: 'ASC' },
            relations: ['user1', 'user2'],
        });

        return rooms;
    }

    async findExistingRoom(
        currentUserId: number,
        userId: number,
    ): Promise<ChatRoom | null> {
        const existingRoom = await this.chatRoomRepository.findOne({
            where: [
                { user1: { id: currentUserId }, user2: { id: userId } },
                { user1: { id: userId }, user2: { id: currentUserId } },
            ],
        });

        return existingRoom || null;
    }
}
