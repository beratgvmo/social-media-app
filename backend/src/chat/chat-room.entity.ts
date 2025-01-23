import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Message } from './message.entity';

@Entity()
export class ChatRoom {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user1: User;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user2: User;

    @OneToMany(() => Message, (message) => message.chatRoom)
    messages: Message[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastMessageDate: Date;
}
