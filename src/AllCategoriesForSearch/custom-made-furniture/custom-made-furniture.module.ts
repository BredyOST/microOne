import { Module } from '@nestjs/common';
import { CustomMadeFurnitureService } from './custom-made-furniture.service';
import { CustomMadeFurnitureController } from './custom-made-furniture.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { CitiesModule } from '../../cities/cities.module';
import { RedisService } from '../../redis/redis.service';
import { LogsService } from '../../otherServices/logger.service';
import { RepositoryPostsAdd } from '../../otherServices/logger.module';
import { CustomMadeFurnitureEntity } from './entities/custom-made-furniture.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([CustomMadeFurnitureEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    CitiesModule,
  ],
  controllers: [CustomMadeFurnitureController],
  providers: [
    CustomMadeFurnitureService,
    RedisService,
    LogsService,
    RepositoryPostsAdd,
  ],
  exports: [CustomMadeFurnitureService],
})
export class CustomMadeFurnitureModule {}
