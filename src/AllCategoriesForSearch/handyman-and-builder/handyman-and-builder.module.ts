import { Module } from '@nestjs/common';
import { HandymanAndBuilderService } from './handyman-and-builder.service';
import { HandymanAndBuilderController } from './handyman-and-builder.controller';
import { HttpModule } from '@nestjs/axios';
import { HandymanAndBuilderEntity } from './entities/handyman-and-builder.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisService } from '../../redis/redis.service';
import { LogsService } from '../../otherServices/logger.service';
import { RepositoryPostsAdd } from '../../otherServices/logger.module';
import {CitiesModule} from "../../cities/cities.module";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([HandymanAndBuilderEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    CitiesModule,
  ],
  controllers: [HandymanAndBuilderController],
  providers: [
    HandymanAndBuilderService,
    RedisService,
    LogsService,
    RepositoryPostsAdd,
  ],
  exports: [HandymanAndBuilderService],
})
export class HandymanAndBuilderModule {}
