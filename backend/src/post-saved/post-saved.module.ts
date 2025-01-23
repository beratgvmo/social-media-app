import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostSavedController } from './post-saved.controller';
import { PostSavedService } from './post-saved.service';
import { PostSaved } from './post-saved.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PostSaved])],
    controllers: [PostSavedController],
    providers: [PostSavedService],
    exports: [PostSavedService],
})
export class PostSavedModule {}
