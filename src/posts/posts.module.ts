import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { PostEntity } from './entities/post.entity';
import { RedisService } from '../redis/redis.service';
import { LogsModule, RepositoryPostsAdd } from '../otherServices/logger.module';
import { LogsService } from '../otherServices/logger.service';
import { NanniesModule } from '../AllCategoriesForSearch/nannies/nannies.module';
import { TutorsModule } from '../AllCategoriesForSearch/tutors/tutors.module';
import { HandymanAndBuilderModule } from '../AllCategoriesForSearch/handyman-and-builder/handyman-and-builder.module';
import { EquipRepairMaintenanceModule } from '../AllCategoriesForSearch/equip-repair-maintenance/equip-repair-maintenance.module';
import { PurchaseSaleApartModule } from '../AllCategoriesForSearch/purchase-sale-apart/purchase-sale-apart.module';
import { RentRentalApartModule } from '../AllCategoriesForSearch/rent-rental-apart/rent-rental-apart.module';
import { LawyerModule } from '../AllCategoriesForSearch/lawyer/lawyer.module';
import {ItWebModule} from "../AllCategoriesForSearch/it-web/it-web.module";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([PostEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TutorsModule,
    NanniesModule,
    LogsModule,
    HandymanAndBuilderModule,
    EquipRepairMaintenanceModule,
    PurchaseSaleApartModule,
    RentRentalApartModule,
    LawyerModule,
    ItWebModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, LogsService, RedisService, RepositoryPostsAdd],
  exports: [PostsService],
})
export class PostsModule {}
