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
        return this.messageRepository.save(message);
    }

    async getMessagesByRoomId(chatRoomId: number): Promise<Message[]> {
        const messages = await this.messageRepository.find({
            where: { chatRoom: { id: chatRoomId } },
            order: { createdAt: 'ASC' },
            relations: ['sender'],
        });

        return messages;
    }

    async getUserRooms(userId: number): Promise<ChatRoom[]> {
        const rooms = await this.chatRoomRepository.find({
            where: [{ user1: { id: userId } }, { user2: { id: userId } }],
            order: { createdAt: 'ASC' },
            relations: ['user1', 'user2'],
        });

        if (!rooms.length) {
            throw new NotFoundException('Kullanıcının chat odası bulunamadı.');
        }

        return rooms;
    }
}
