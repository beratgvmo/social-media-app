import { Post } from '../post/post.entity';
import { Comment } from '../comment/commet.entity';
import { Like } from '../like/like.entity';
import { Follower } from '../follower/follower.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    profileImage: string;

    @Column({ nullable: true })
    bannerImage: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @OneToMany(() => Like, (like) => like.user)
    likes: Like[];

    @OneToMany(() => Follower, (follower) => follower.following)
    followers: Follower[];

    @OneToMany(() => Follower, (follower) => follower.follower)
    following: Follower[];
}
