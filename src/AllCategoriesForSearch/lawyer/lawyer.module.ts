import { Module } from '@nestjs/common';
import { LawyerService } from './lawyer.service';
import { LawyerController } from './lawyer.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { LawyerEntity } from './entities/lawyer.entity';
import { LogsService } from '../../otherServices/logger.service';
import { RedisService } from '../../redis/redis.service';
import { RepositoryPostsAdd } from '../../otherServices/logger.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([LawyerEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
  ],
  controllers: [LawyerController],
  providers: [LawyerService, LogsService, RedisService, RepositoryPostsAdd],
  exports: [LawyerService],
})
export class LawyerModule {}
