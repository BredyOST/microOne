import { Module } from '@nestjs/common';
import { AccountantService } from './accountant.service';
import { AccountantController } from './accountant.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { CitiesModule } from '../../cities/cities.module';
import { RedisService } from '../../redis/redis.service';
import { LogsService } from '../../otherServices/logger.service';
import { RepositoryPostsAdd } from '../../otherServices/logger.module';
import { AccountantEntity } from './entities/accountant.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([AccountantEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    CitiesModule,
  ],
  controllers: [AccountantController],
  providers: [AccountantService, RedisService, LogsService, RepositoryPostsAdd],
  exports: [AccountantService],
})
export class AccountantModule {}
