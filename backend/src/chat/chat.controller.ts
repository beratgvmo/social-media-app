import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    NotFoundException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from './message.entity';
import { ChatRoom } from './chat-room.entity';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get('messages/:chatRoomId')
    async getMessages(
        @Param('chatRoomId', ParseIntPipe) chatRoomId: number,
    ): Promise<Message[]> {
        const messages = await this.chatService.getMessagesByRoomId(chatRoomId);
        if (!messages.length) {
            throw new NotFoundException('Mesaj bulunamadı.');
        }
        return messages;
    }

    @Get('userRooms/:id')
    async getUserRooms(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ChatRoom[]> {
        const rooms = await this.chatService.getUserRooms(id);
        return rooms;
    }
}
