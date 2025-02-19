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

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('userId')
    handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() userId: number,
    ) {
        client.join(userId.toString());
        console.log(`user ${userId}`);
    }

    @SubscribeMessage('createRoom')
    async createRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() userId: number,
    ) {
        if (!userId) {
            return console.error('userId is undefined');
        }

        try {
            const notificationCount =
                await this.notificationService.getUnreadNotificationCount(
                    userId,
                );
            this.server
                .to(userId.toString())
                .emit('notification', notificationCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            client.emit('error', { message: 'Notification error.' });
        }
    }

    @SubscribeMessage('sendNotification')
    async handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() userId: number,
    ) {
        if (!userId) {
            return console.error('userId is undefined');
        }

        try {
            const notificationCount =
                await this.notificationService.getUnreadNotificationCount(
                    userId,
                );
            this.server
                .to(userId.toString())
                .emit('notification', notificationCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            client.emit('error', { message: 'Notification error.' });
        }
    }
}
