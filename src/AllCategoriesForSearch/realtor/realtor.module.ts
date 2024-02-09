import { Module } from '@nestjs/common';
import { RealtorService } from './realtor.service';
import { RealtorController } from './realtor.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { RealtorEntity } from './entities/realtor.entity';
import { LogsService } from '../../otherServices/logger.service';
import { RedisService } from '../../redis/redis.service';
import { RepositoryPostsAdd } from '../../otherServices/logger.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([RealtorEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
  ],
  controllers: [RealtorController],
  providers: [
    RealtorService,
    LogsService,
    RedisService,
    RepositoryPostsAdd
  ],
  exports: [RealtorService],
})
export class RealtorModule {}
