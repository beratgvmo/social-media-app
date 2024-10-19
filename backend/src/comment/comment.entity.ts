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

    @ManyToOne(() => Post, (post) => post.comments)
    post: Post;

    @OneToMany(() => Like, (like) => like.comment)
    likes: Like[];
}
