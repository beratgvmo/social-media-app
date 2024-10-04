import { User } from '../user/user.entity';
import { Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Follower {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.following)
    follower: User;

    @ManyToOne(() => User, (user) => user.followers)
    following: User;
}
