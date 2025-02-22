import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    BeforeInsert,
    BeforeUpdate,
} from 'typeorm';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';
import { Like } from '../like/like.entity';
import { Follower } from '../follower/follower.entity';
import { Notification } from '../notification/notification.entity';
import { Message } from 'src/chat/message.entity';
import { ChatRoom } from 'src/chat/chat-room.entity';
import { PostSaved } from 'src/post-saved/post-saved.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column({ select: false })
    password: string;

    @Column({ nullable: true })
    bio: string;

    @Column({ default: false })
    isPrivate: boolean;

    @Column({ nullable: true })
    profileImage: string;

    @Column({ nullable: true })
    bannerImage: string;

    @Column({ unique: true })
    slug: string;

    @Column({ default: 0 })
    followerCount: number;

    @Column({ default: 0 })
    followingCount: number;

    @CreateDateColumn({ select: false })
    createdAt: Date;

    @UpdateDateColumn({ select: false })
    updatedAt: Date;

    @OneToMany(() => Message, (message) => message.sender, {
        onDelete: 'CASCADE',
    })
    messages: Message[];

    @OneToMany(() => Post, (post) => post.user, { onDelete: 'CASCADE' })
    posts: Post[];

    @OneToMany(() => PostSaved, (postSaved) => postSaved.user, {
        onDelete: 'CASCADE',
    })
    savedPosts: PostSaved[];

    @OneToMany(() => Comment, (comment) => comment.user, {
        onDelete: 'CASCADE',
    })
    comments: Comment[];

    @OneToMany(() => Like, (like) => like.user, { onDelete: 'CASCADE' })
    likes: Like[];

    @OneToMany(() => Follower, (follower) => follower.following, {
        onDelete: 'CASCADE',
    })
    followers: Follower[];

    @OneToMany(() => Follower, (follower) => follower.follower, {
        onDelete: 'CASCADE',
    })
    following: Follower[];

    @OneToMany(() => Notification, (notification) => notification.user, {
        onDelete: 'CASCADE',
    })
    notifications: Notification[];

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        if (!this.slug && this.name) {
            const baseSlug = this.createSlug(this.name);
            this.slug = `${baseSlug}-${this.generateRandomString(9)}`;
        }
    }

    private createSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9çşüöğı\s]+/gi, '')
            .replace(/\s+/g, '-');
    }

    private generateRandomString(length: number): string {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * characters.length),
            );
        }
        return result;
    }
}
