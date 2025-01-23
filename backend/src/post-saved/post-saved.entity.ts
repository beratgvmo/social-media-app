import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';

@Entity('post_saved')
export class PostSaved {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.savedPosts, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Post, (post) => post.savedByUsers, { onDelete: 'CASCADE' })
    post: Post;

    @CreateDateColumn()
    createdAt: Date;
}
