import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Post } from '../post/post.entity';

@Entity()
export class PostImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @ManyToOne(() => Post, (post) => post.postImages, { onDelete: 'CASCADE' })
    post: Post;
}
