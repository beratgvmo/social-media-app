import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';

@Entity()
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.likes)
    user: User;

    @ManyToOne(() => Post, (post) => post.likes, { nullable: true })
    post: Post;

    @ManyToOne(() => Comment, (comment) => comment.likes, { nullable: true })
    comment: Comment;
}
