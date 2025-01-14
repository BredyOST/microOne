import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigModule } from "@nestjs/config";
import { CitiesModule } from "../../cities/cities.module";
import { DriverEntity } from "./entities/driver.entity";
import { RedisService } from "../../redis/redis.service";
import { LogsService } from "../../otherServices/logger.service";
import { RepositoryPostsAdd } from "../../otherServices/logger.module";
import { BeautyService } from "../beauty/beauty.service";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([DriverEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    CitiesModule,
  ],
  controllers: [DriversController],
  providers: [DriversService, RedisService, LogsService, RepositoryPostsAdd],
  exports:[DriversService]
})
export class DriversModule {}
