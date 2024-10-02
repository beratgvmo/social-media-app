import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/auth/user.entity';
import { Response } from 'express';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
    ) {}

    async createPost(
        createPostDto: CreatePostDto,
        userId: number,
    ): Promise<Post> {
        const post = this.postRepository.create({
            text: createPostDto.text,
            user: { id: userId },
        });
        return await this.postRepository.save(post);
    }

    async allPost(id: number) {
        try {
            const userPosts = await this.postRepository.find({
                where: { user: { id } },
                select: ['id', 'text', 'createdAt', 'likes'],
                order: {
                    createdAt: 'DESC',
                },
            });
            return userPosts;
        } catch (error) {
            throw new Error('Error user post all');
        }
    }

    async findOneDelete(id: number, res: Response) {
        try {
            await this.postRepository.delete(id);

            res.status(200).send({
                message: 'Başarılı Şekilde Silindi',
            });
        } catch (error) {
            throw new Error('Error user post delete');
        }
    }
}
