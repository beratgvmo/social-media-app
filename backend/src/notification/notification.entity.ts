import { User } from '../user/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.notifications, {
        onDelete: 'CASCADE',
    })
    user: User;

    @Column()
    type: 'comment' | 'like' | 'follow' | 'post';

    @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
    fromUser: User;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
