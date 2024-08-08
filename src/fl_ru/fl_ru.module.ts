import { Module } from '@nestjs/common';
import { FlRuService } from './fl_ru.service';
import { FlRuController } from './fl_ru.controller';
import {HttpModule} from "@nestjs/axios";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ScheduleModule} from "@nestjs/schedule";
import {ConfigModule} from "@nestjs/config";
import {LogsModule, RepositoryPostsAdd} from "../otherServices/logger.module";
import {ItWebModule} from "../AllCategoriesForSearch/it-web/it-web.module";
import {LogsService} from "../otherServices/logger.service";
import {RedisService} from "../redis/redis.service";
import {FlRuEntity} from "./entities/fl_ru.entity";


@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([FlRuEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    LogsModule,
    ItWebModule,
  ],
  controllers: [FlRuController],
  providers: [FlRuService, LogsService, RedisService, RepositoryPostsAdd],
  exports: []
})
export class FlRuModule {}
