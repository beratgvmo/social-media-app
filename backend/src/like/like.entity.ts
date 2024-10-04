import { User } from '../user/user.entity';
import { Comment } from '../comment/commet.entity';
import { Post } from '../post/post.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
