import { Module } from '@nestjs/common';
import { FotoVideoCreaterService } from './foto-video-creater.service';
import { FotoVideoCreaterController } from './foto-video-creater.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { CitiesModule } from '../../cities/cities.module';
import { RedisService } from '../../redis/redis.service';
import { LogsService } from '../../otherServices/logger.service';
import { RepositoryPostsAdd } from '../../otherServices/logger.module';
import { FotoVideoCreaterEntity } from './entities/foto-video-creater.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([FotoVideoCreaterEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    CitiesModule,
  ],
  controllers: [FotoVideoCreaterController],
  providers: [
    FotoVideoCreaterService,
    RedisService,
    LogsService,
    RepositoryPostsAdd,
  ],
  exports: [FotoVideoCreaterService],
})
export class FotoVideoCreaterModule {}
