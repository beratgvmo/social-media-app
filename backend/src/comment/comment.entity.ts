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

    @ManyToOne(() => Comment, (comment) => comment.replies, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    parentComment: Comment;

    @Column({ default: 0 })
    likeCount: number;

    @OneToMany(() => Like, (like) => like.comment, { cascade: true })
    likes: Like[];

    @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
    post: Post;

    @OneToMany(() => Comment, (comment) => comment.parentComment)
    replies: Comment[];
}
