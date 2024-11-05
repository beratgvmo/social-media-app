import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { ChatRoom } from './chat-room.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
    sender: User;

    @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages, {
        onDelete: 'CASCADE',
    })
    chatRoom: ChatRoom;

    @Column({ default: false }) // Mesajın okunup okunmadığı
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date; // Mesajın en son güncellenme tarihi
}
