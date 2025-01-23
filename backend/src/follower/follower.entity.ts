import { User } from '../user/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

export enum FollowStatus {
    ACCEPTED = 'accepted',
    PENDING = 'pending',
}

@Entity()
export class Follower {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.following)
    follower: User;

    @ManyToOne(() => User, (user) => user.followers)
    following: User;

    @Column({
        type: 'enum',
        enum: FollowStatus,
        default: FollowStatus.PENDING,
    })
    status: FollowStatus;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
