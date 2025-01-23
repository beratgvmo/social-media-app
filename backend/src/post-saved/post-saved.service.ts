import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostSaved } from './post-saved.entity';

@Injectable()
export class PostSavedService {
    constructor(
        @InjectRepository(PostSaved)
        private readonly postSavedRepository: Repository<PostSaved>,
    ) {}

    async findAll(page: number, limit: number): Promise<PostSaved[]> {
        const skip = (page - 1) * limit;

        return await this.postSavedRepository.find({
            relations: ['post', 'post.user'],
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
    }

    async savePost(postId: number, userId: number) {
        const isSave = await this.postSavedRepository.findOne({
            where: { user: { id: userId }, post: { id: postId } },
        });

        if (isSave) {
            await this.postSavedRepository.remove(isSave);
        } else {
            const newPostSaved = this.postSavedRepository.create({
                user: { id: userId },
                post: { id: postId },
            });

            await this.postSavedRepository.save(newPostSaved);
        }
    }

    async checkSavePost(userId: number, postId: number): Promise<boolean> {
        const check = await this.postSavedRepository.findOne({
            where: { user: { id: userId }, post: { id: postId } },
        });
        return !!check;
    }
}
