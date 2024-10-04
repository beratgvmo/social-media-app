import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Post } from '../post/post.entity';

@Entity()
export class PostImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column()
    order: number;

    @ManyToOne(() => Post, (post) => post.postImages)
    post: Post;
}
