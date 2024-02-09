import { Module } from '@nestjs/common';
import { ItService } from './it.service';
import { ItController } from './it.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { LogsService } from '../../otherServices/logger.service';
import { RedisService } from '../../redis/redis.service';
import { RepositoryPostsAdd } from '../../otherServices/logger.module';
import { ItEntity } from './entities/it.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([ItEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
  ],
  controllers: [ItController],
  providers: [
    ItService,
    LogsService,
    RedisService,
    RepositoryPostsAdd
  ],
  exports: [ItService],
})
export class ItModule {}
