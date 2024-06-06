import { Module } from '@nestjs/common';
import { BeautyService } from './beauty.service';
import { BeautyController } from './beauty.controller';
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigModule } from "@nestjs/config";
import { CitiesModule } from "../../cities/cities.module";
import { BeautyEntity } from "./entities/beauty.entity";
import { RedisService } from "../../redis/redis.service";
import { LogsService } from "../../otherServices/logger.service";
import { RepositoryPostsAdd } from "../../otherServices/logger.module";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([BeautyEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    CitiesModule,
  ],
  controllers: [BeautyController],
  providers: [BeautyService, RedisService, LogsService, RepositoryPostsAdd],
  exports:[BeautyService]
})
export class BeautyModule {}
