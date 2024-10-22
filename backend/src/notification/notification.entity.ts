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

    @ManyToOne(() => User, (user) => user.notifications)
    user: User;

    @Column()
    type: 'comment' | 'like' | 'followRequest';

    @ManyToOne(() => Post, { nullable: true })
    post: Post;

    @ManyToOne(() => User, { nullable: true })
    fromUser: User;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
