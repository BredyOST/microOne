import { Module } from '@nestjs/common';
import { VideoCreaterService } from './video-creater.service';
import { VideoCreaterController } from './video-creater.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { VideoCreaterEntity } from './entities/video-creater.entity';
import { LogsService } from '../../otherServices/logger.service';
import { RedisService } from '../../redis/redis.service';
import { RepositoryPostsAdd } from '../../otherServices/logger.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([VideoCreaterEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
  ],
  controllers: [VideoCreaterController],
  providers: [
    VideoCreaterService,
    LogsService,
    RedisService,
    RepositoryPostsAdd,
  ],
  exports: [VideoCreaterService],
})
export class VideoCreaterModule {}
