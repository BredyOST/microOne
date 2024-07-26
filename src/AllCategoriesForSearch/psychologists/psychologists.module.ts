import { Module } from '@nestjs/common';
import { PsychologistsService } from './psychologists.service';
import { PsychologistsController } from './psychologists.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { CitiesModule } from '../../cities/cities.module';
import { PsychologistEntity } from './entities/psychologist.entity';
import { LogsService } from '../../otherServices/logger.service';
import { RedisService } from '../../redis/redis.service';
import { RepositoryPostsAdd } from '../../otherServices/logger.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([PsychologistEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    CitiesModule,
  ],
  controllers: [PsychologistsController],
  providers: [
    PsychologistsService,
    LogsService,
    RedisService,
    RepositoryPostsAdd,
  ],
  exports: [PsychologistsService],
})
export class PsychologistsModule {}
