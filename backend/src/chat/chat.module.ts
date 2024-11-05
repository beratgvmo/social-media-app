import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message } from './message.entity';
import { ChatRoom } from './chat-room.entity';
import { ChatController } from './chat.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Message, ChatRoom])],
    controllers: [ChatController],
    providers: [ChatGateway, ChatService],
})
export class ChatModule {}
