import { Module } from '@nestjs/common';
import { RentRentalApartService } from './rent-rental-apart.service';
import { RentRentalApartController } from './rent-rental-apart.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { RentRentalApartEntity } from './entities/rent-rental-apart.entity';
import { RedisService } from '../../redis/redis.service';
import { LogsService } from '../../otherServices/logger.service';
import { RepositoryPostsAdd } from '../../otherServices/logger.module';
import {CitiesModule} from "../../cities/cities.module";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([RentRentalApartEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    CitiesModule,
  ],
  controllers: [RentRentalApartController],
  providers: [
    RentRentalApartService,
    RedisService,
    LogsService,
    RepositoryPostsAdd,
  ],
  exports: [RentRentalApartService],
})
export class RentRentalApartModule {}
