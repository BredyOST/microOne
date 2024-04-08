import { Module } from '@nestjs/common';
import { PurchaseSaleApartService } from './purchase-sale-apart.service';
import { PurchaseSaleApartController } from './purchase-sale-apart.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { PurchaseSaleApartEntity } from './entities/purchase-sale-apart.entity';
import { RedisService } from '../../redis/redis.service';
import { LogsService } from '../../otherServices/logger.service';
import { RepositoryPostsAdd } from '../../otherServices/logger.module';
import {CitiesModule} from "../../cities/cities.module";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([PurchaseSaleApartEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    CitiesModule,
  ],
  controllers: [PurchaseSaleApartController],
  providers: [
    PurchaseSaleApartService,
    RedisService,
    LogsService,
    RepositoryPostsAdd,
  ],
  exports:[PurchaseSaleApartService]
})
export class PurchaseSaleApartModule {}
