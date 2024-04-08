import { Module } from '@nestjs/common';
import { EquipRepairMaintenanceService } from './equip-repair-maintenance.service';
import { EquipRepairMaintenanceController } from './equip-repair-maintenance.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { EquipRepairMaintenanceEntity } from './entities/equip-repair-maintenance.entity';
import { RedisService } from '../../redis/redis.service';
import { LogsService } from '../../otherServices/logger.service';
import { RepositoryPostsAdd } from '../../otherServices/logger.module';
import {CitiesModule} from "../../cities/cities.module";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([EquipRepairMaintenanceEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    CitiesModule,
  ],
  controllers: [EquipRepairMaintenanceController],
  providers: [
    EquipRepairMaintenanceService,
    RedisService,
    LogsService,
    RepositoryPostsAdd,
  ],
  exports: [EquipRepairMaintenanceService],
})
export class EquipRepairMaintenanceModule {}
