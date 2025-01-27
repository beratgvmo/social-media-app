import { User } from '../user/user.entity';
import { Like } from '../like/like.entity';
import { PostImage } from '../post-images/post-images.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Comment } from '../comment/comment.entity';
import { PostSaved } from 'src/post-saved/post-saved.entity';

export enum PostType {
    CODE = 'code',
    TEXT = 'text',
}

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    content: string;

    @Column({
        type: 'enum',
        enum: PostType,
        default: PostType.TEXT,
    })
    type: PostType;

    @Column({ default: 0 })
    likeCount: number;

    @Column({ default: 0 })
    commetCount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.posts)
    user: User;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];

    @OneToMany(() => PostImage, (postImage) => postImage.post)
    postImages: PostImage[];

    @OneToMany(() => Like, (like) => like.post)
    likes: Like[];

    @OneToMany(() => PostSaved, (postsaved) => postsaved.post)
    savedByUsers: PostSaved[];
}
