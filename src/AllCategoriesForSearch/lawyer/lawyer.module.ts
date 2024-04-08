import { Module } from '@nestjs/common';
import { LawyerService } from './lawyer.service';
import { LawyerController } from './lawyer.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { LawyerEntity } from './entities/lawyer.entity';
import { RedisService } from '../../redis/redis.service';
import { LogsService } from '../../otherServices/logger.service';
import { RepositoryPostsAdd } from '../../otherServices/logger.module';
import {CitiesModule} from "../../cities/cities.module";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([LawyerEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    CitiesModule,
  ],
  controllers: [LawyerController],
  providers: [LawyerService, RedisService, LogsService, RepositoryPostsAdd],
  exports:[LawyerService]
})
export class LawyerModule {}
