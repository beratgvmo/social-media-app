import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private chatService: ChatService) {}

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() chatRoomId: number,
    ) {
        client.join(chatRoomId.toString());
        console.log(`Client ${client.id} joined room ${chatRoomId}`);
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody()
        payload: { content: string; chatRoomId: number; senderId: number },
    ) {
        try {
            const message = await this.chatService.createMessage(
                payload.content,
                payload.chatRoomId,
                payload.senderId,
            );
            console.log('Yeni mesaj oluşturuldu:', message);

            this.server
                .to(payload.chatRoomId.toString())
                .emit('newMessage', message);
        } catch (error) {
            console.error('Mesaj gönderimi hatası:', error);
            client.emit('error', { message: 'Mesaj gönderilemedi.' });
        }
    }

    @SubscribeMessage('deleteRoom')
    async handleDeleteRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() chatRoomId: number,
    ) {
        try {
            await this.chatService.deleteRoom(chatRoomId);
            console.log(chatRoomId);

            this.server
                .to(chatRoomId.toString())
                .emit('roomDeleted', { chatRoomId });
        } catch (error) {
            client.emit('error', { message: error.message });
        }
    }
}
