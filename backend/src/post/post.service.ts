import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CodeTheme, GithubType, Post } from './post.entity';
import { In, Not, Repository } from 'typeorm';
import { PostImage } from '../post-images/post-images.entity';
import { User } from 'src/user/user.entity';
import { Like } from 'src/like/like.entity';
import { Comment } from 'src/comment/comment.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,

        @InjectRepository(PostImage)
        private postImageRepository: Repository<PostImage>,

        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,

        @InjectRepository(Like)
        private likeRepository: Repository<Like>,
    ) {}

    async createPost(
        content: string,
        codeContent: string,
        codeLanguage: string,
        codeTheme: CodeTheme,
        githubApiUrl: string,
        githubType: GithubType,
        imageUrls: string[] = [],
        userId: number,
    ): Promise<Post> {
        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const hasCode = !!codeContent;
        const hasGithub = !!githubApiUrl;
        const hasImages = imageUrls.length > 0;

        if ([hasCode, hasGithub, hasImages].filter(Boolean).length > 1) {
            throw new BadRequestException(
                'Sadece bir tür içerik paylaşabilirsiniz: Kod, GitHub veya Resim.',
            );
        }

        const post = this.postRepository.create({
            content,
            user,
        });

        if (hasCode) {
            post.codeContent = codeContent;
            post.codeLanguage = codeLanguage;
            post.codeTheme = codeTheme;
        } else if (hasGithub) {
            post.githubApiUrl = githubApiUrl;
            post.githubType = githubType;
        }

        const savedPost = await this.postRepository.save(post);

        if (hasImages) {
            const postImages = imageUrls.map((url) =>
                this.postImageRepository.create({ url, post: savedPost }),
            );
            await this.postImageRepository.save(postImages);
        }

        return this.postRepository.findOne({
            where: { id: savedPost.id },
            relations: ['postImages', 'user'],
        });
    }

    async updatePost(
        postId: number,
        content: string,
        codeContent: string,
        codeLanguage: string,
        codeTheme: CodeTheme,
        githubApiUrl: string,
        githubType: GithubType,
        imageUrls: string[] = [],
        userId: number,
    ): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: ['user', 'postImages'],
        });

        if (!post) {
            throw new NotFoundException('Post bulunamadı.');
        }

        if (post.user.id !== userId) {
            throw new ForbiddenException('Bu postu düzenleme yetkiniz yok.');
        }

        const hasCode = !!codeContent;
        const hasGithub = !!githubApiUrl;
        const hasImages = imageUrls.length > 0;

        if ([hasCode, hasGithub, hasImages].filter(Boolean).length > 1) {
            throw new BadRequestException(
                'Sadece bir tür içerik paylaşabilirsiniz: Kod, GitHub veya Resim.',
            );
        }

        post.content = content;

        if (hasCode) {
            post.codeContent = codeContent;
            post.codeLanguage = codeLanguage;
            post.codeTheme = codeTheme;

            post.githubApiUrl = null;
            post.githubType = null;
        } else if (hasGithub) {
            post.githubApiUrl = githubApiUrl;
            post.githubType = githubType;

            post.codeContent = null;
            post.codeLanguage = null;
            post.codeTheme = null;
        } else {
            post.codeContent = null;
            post.codeLanguage = null;
            post.codeTheme = null;
            post.githubApiUrl = null;
            post.githubType = null;
        }

        const updatedPost = await this.postRepository.save(post);

        if (hasImages) {
            await this.postImageRepository.delete({ post: { id: postId } });

            const postImages = imageUrls.map((url) =>
                this.postImageRepository.create({ url, post: updatedPost }),
            );
            await this.postImageRepository.save(postImages);
        } else {
            await this.postImageRepository.delete({ post: { id: postId } });
        }

        return this.postRepository.findOne({
            where: { id: updatedPost.id },
            relations: ['postImages', 'user'],
        });
    }

    async findAllPosts(
        page: number,
        limit: number,
        userId: number,
    ): Promise<Post[]> {
        const skip = (page - 1) * limit;

        return this.postRepository.find({
            where: {
                user: {
                    id: Not(userId),
                },
            },
            relations: ['postImages', 'user'],
            skip,
            take: limit,
            order: {
                likeCount: 'DESC',
                commentCount: 'DESC',
                createdAt: 'DESC',
            },
        });
    }

    async findProfilPosts(
        page: number,
        limit: number,
        userSlug: string,
    ): Promise<Post[]> {
        const skip = (page - 1) * limit;

        return this.postRepository.find({
            where: {
                user: {
                    slug: userSlug,
                },
            },
            relations: ['postImages', 'user'],
            skip,
            take: limit,
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async findPostByIdAndSlug(postId: number, slug: string): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: ['user'],
        });

        console.log(post);

        if (!post || post.user.slug !== slug) {
            throw new NotFoundException('Post not found');
        }
        return post;
    }

    async deletePost(postId: number, userId: number): Promise<void> {
        const post = await this.postRepository.findOne({
            where: { id: postId, user: { id: userId } },
            relations: ['comments', 'likes', 'postImages'],
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const commentIds = post.comments.map((comment) => comment.id);
        const likeIds = post.likes.map((like) => like.id);
        const postImageIds = post.postImages.map((postImage) => postImage.id);

        if (commentIds.length > 0) {
            const commentLikes = await this.likeRepository.find({
                where: { comment: In(commentIds) },
            });
            const commentLikeIds = commentLikes.map((like) => like.id);
            if (commentLikeIds.length > 0) {
                await this.likeRepository.delete({ id: In(commentLikeIds) });
            }
            await this.commentRepository.delete({ id: In(commentIds) });
        }

        if (likeIds.length > 0) {
            await this.likeRepository.delete({ id: In(likeIds) });
        }

        if (postImageIds.length > 0) {
            await this.postImageRepository.delete({ id: In(postImageIds) });
        }

        await this.postRepository.delete(post.id);
    }
}
