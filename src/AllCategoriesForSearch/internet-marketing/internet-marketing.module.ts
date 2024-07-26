import { Module } from '@nestjs/common';
import { InternetMarketingService } from './internet-marketing.service';
import { InternetMarketingController } from './internet-marketing.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { CitiesModule } from '../../cities/cities.module';
import { RedisService } from '../../redis/redis.service';
import { LogsService } from '../../otherServices/logger.service';
import { RepositoryPostsAdd } from '../../otherServices/logger.module';
import { InternetMarketingEntity } from './entities/internet-marketing.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([InternetMarketingEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    CitiesModule,
  ],
  controllers: [InternetMarketingController],
  providers: [
    InternetMarketingService,
    RedisService,
    LogsService,
    RepositoryPostsAdd,
  ],
  exports: [InternetMarketingService],
})
export class InternetMarketingModule {}
