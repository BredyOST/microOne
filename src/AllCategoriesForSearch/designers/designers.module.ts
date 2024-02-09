import { Module } from '@nestjs/common';
import { DesignersService } from './designers.service';
import { DesignersController } from './designers.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { DesignerEntity } from './entities/designer.entity';
import { LogsService } from '../../otherServices/logger.service';
import { RedisService } from '../../redis/redis.service';
import { RepositoryPostsAdd } from '../../otherServices/logger.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([DesignerEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
  ],
  controllers: [DesignersController],
  providers: [
    DesignersService,
    LogsService,
    RedisService,
    RepositoryPostsAdd
  ],
  exports: [DesignersService],
})
export class DesignersModule {}
