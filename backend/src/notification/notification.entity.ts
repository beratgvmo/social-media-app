import { Post } from 'src/post/post.entity';
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
        eager: true,
    })
    user: User;

    @Column({ type: 'enum', enum: ['comment', 'like', 'follow'] })
    type: 'comment' | 'like' | 'follow';

    @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE', eager: true })
    fromUser?: User;

    @ManyToOne(() => Post, { nullable: true, onDelete: 'CASCADE', eager: true })
    post?: Post;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
