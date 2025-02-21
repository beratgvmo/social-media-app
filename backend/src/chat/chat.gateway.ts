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
    @WebSocketServer() server: Server;

    constructor(private readonly chatService: ChatService) {}

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

    @SubscribeMessage('createRoom')
    async handleCreateRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { currentUserId: number; userId: number },
    ) {
        try {
            const room = await this.chatService.createRoom(
                payload.currentUserId,
                payload.userId,
            );

            this.server.to(room.id.toString()).emit('room', room.id);

            client.emit('chatRoom', room);
        } catch (error) {
            console.error('Error creating room:', error);
            client.emit('error', { message: 'Room creation failed.' });
        }
    }

    @SubscribeMessage('sendDeleteRoom')
    async handleDeleteRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { chatRoomId: number; userId: number },
    ) {
        try {
            await this.chatService.deleteRoom(payload.chatRoomId);

            const data = await this.chatService.getUserRooms(payload.userId);

            this.server
                .to(payload.chatRoomId.toString())
                .emit('roomDeleted', payload.chatRoomId);

            client.emit('chatRoom', data);
        } catch (error) {
            console.error('Error deleting room:', error);
            client.emit('error', { message: 'Room deletion failed.' });
        }
    }
}
