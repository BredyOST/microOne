import { Module } from '@nestjs/common';
import { NanniesController } from './nannies.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { NannyEntity } from './entities/nanny.entity';
import { NanniesService } from './nannies.service';
import { RedisService } from '../../redis/redis.service';
import { LogsService } from '../../otherServices/logger.service';
import { RepositoryPostsAdd } from '../../otherServices/logger.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([NannyEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
  ],
  controllers: [NanniesController],
  providers: [
    NanniesService,
    LogsService,
    RedisService,
    RepositoryPostsAdd
  ],
  exports: [NanniesService],
})
export class NanniesModule {}
