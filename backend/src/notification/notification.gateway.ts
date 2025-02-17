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
import { NotificationService } from './notification.service';

@WebSocketGateway({ cors: true })
export class NotificationGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server: Server;

    constructor(private notificationService: NotificationService) {}

    handleConnection(client: Socket): void {
        console.log('Yeni f bağlantı:', client.id);
    }

    handleDisconnect(client: Socket): void {
        console.log('Bağlantı f kesildi:', client.id);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() userId: number,
    ): void {
        console.log(`Kullanıcı ${userId} bildirim odasına katıldı.`); // Burada userId'yi yazdıralım.
        client.join(userId.toString());
        console.log(`Client ${client.id} joined room ${userId}`);
    }

    @SubscribeMessage('notification')
    async sendNotification(
        @ConnectedSocket() client: Socket,
        @MessageBody() userId: number,
    ): Promise<void> {
        const unreadCount =
            await this.notificationService.countUnreadNotifications(userId);
        console.log('Bildirim sayısı:', unreadCount);
        this.server.to(userId.toString()).emit('notification', { unreadCount });
    }
}
