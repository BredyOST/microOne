import { Module } from '@nestjs/common';
import { TutorsController } from './tutors.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorEntity } from './entities/tutor.entity';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TutorsService } from './tutors.service';
import { RedisService } from '../../redis/redis.service';
import { LogsService } from '../../otherServices/logger.service';
import { RepositoryPostsAdd } from '../../otherServices/logger.module';
import {CitiesModule} from "../../cities/cities.module";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([TutorEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    CitiesModule,
  ],
  controllers: [TutorsController],
  providers: [
    TutorsService,
    RedisService,
    LogsService,
    RepositoryPostsAdd,
  ],
  exports: [TutorsService],
})
export class TutorsModule {}
