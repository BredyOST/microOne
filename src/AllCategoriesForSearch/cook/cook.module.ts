import { Module } from '@nestjs/common';
import { CookService } from './cook.service';
import { CookController } from './cook.controller';
import {HttpModule} from "@nestjs/axios";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ScheduleModule} from "@nestjs/schedule";
import {ConfigModule} from "@nestjs/config";
import {CitiesModule} from "../../cities/cities.module";
import {CookEntity} from "./entities/cook.entity";
import {RedisService} from "../../redis/redis.service";
import {LogsService} from "../../otherServices/logger.service";
import {RepositoryPostsAdd} from "../../otherServices/logger.module";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([CookEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    CitiesModule,
  ],
  controllers: [CookController],
  providers: [CookService, RedisService, LogsService, RepositoryPostsAdd],
  exports:[CookService]
})
export class CookModule {}
