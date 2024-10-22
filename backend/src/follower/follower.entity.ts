import { User } from '../user/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Follower {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.following)
    follower: User;

    @ManyToOne(() => User, (user) => user.followers)
    following: User;

    @Column({ default: 'pending' })
    status: 'accepted' | 'pending';

    @CreateDateColumn()
    createdAt: Date;
}
