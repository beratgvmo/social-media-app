import { Module } from '@nestjs/common';
import { FollowerController } from './follower.controller';
import { FollowerService } from './follower.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follower } from './follower.entity';
import { User } from '../user/user.entity';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
    imports: [TypeOrmModule.forFeature([Follower, User])],
    controllers: [FollowerController],
    providers: [FollowerService],
})
export class FollowerModule {}
