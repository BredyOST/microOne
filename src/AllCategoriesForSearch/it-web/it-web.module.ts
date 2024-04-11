import { Module } from '@nestjs/common';
import { ItWebService } from './it-web.service';
import { ItWebController } from './it-web.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { CitiesModule } from '../../cities/cities.module';
import { ItWebEntity } from './entities/it-web.entity';
import { RedisService } from '../../redis/redis.service';
import { LogsService } from '../../otherServices/logger.service';
import { RepositoryPostsAdd } from '../../otherServices/logger.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([ItWebEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    CitiesModule,
  ],
  controllers: [ItWebController],
  providers: [ItWebService, RedisService, LogsService, RepositoryPostsAdd],
  exports: [ItWebService],
})
export class ItWebModule {}
