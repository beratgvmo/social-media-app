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

export enum GithubType {
    User = 'user',
    Repo = 'repo',
}

export enum CodeTheme {
    Dark = 'dark',
    Light = 'light',
}

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    content: string;

    @Column('text', { nullable: true })
    codeContent?: string;

    @Column('text', { nullable: true })
    codeLanguage?: string;

    @Column({
        type: 'enum',
        enum: CodeTheme,
        nullable: true,
    })
    codeTheme?: CodeTheme;

    @Column('text', { nullable: true })
    githubApiUrl?: string;

    @Column({
        type: 'enum',
        enum: GithubType,
        nullable: true,
    })
    githubType?: GithubType;

    @Column({ default: 0 })
    likeCount: number;

    @Column({ default: 0 })
    commentCount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
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
