import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { Like } from '../like/like.entity';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne(() => User, (user) => user.comments)
    user: User;

    @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
    parentComment: Comment;

    @ManyToOne(() => Post, (post) => post.comments)
    post: Post;

    @OneToMany(() => Comment, (comment) => comment.parentComment)
    replies: Comment[];

    @OneToMany(() => Like, (like) => like.comment)
    likes: Like[];
}
