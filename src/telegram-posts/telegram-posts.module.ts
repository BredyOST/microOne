import { Module } from '@nestjs/common';
import { TelegramPostsService } from './telegram-posts.service';
import { TelegramPostsController } from './telegram-posts.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { TutorsModule } from '../AllCategoriesForSearch/tutors/tutors.module';
import { NanniesModule } from '../AllCategoriesForSearch/nannies/nannies.module';
import { LogsModule, RepositoryPostsAdd } from '../otherServices/logger.module';
import { HandymanAndBuilderModule } from '../AllCategoriesForSearch/handyman-and-builder/handyman-and-builder.module';
import { EquipRepairMaintenanceModule } from '../AllCategoriesForSearch/equip-repair-maintenance/equip-repair-maintenance.module';
import { PurchaseSaleApartModule } from '../AllCategoriesForSearch/purchase-sale-apart/purchase-sale-apart.module';
import { RentRentalApartModule } from '../AllCategoriesForSearch/rent-rental-apart/rent-rental-apart.module';
import { LawyerModule } from '../AllCategoriesForSearch/lawyer/lawyer.module';
import { ItWebModule } from '../AllCategoriesForSearch/it-web/it-web.module';
import { TelegramPostEntity } from './entities/telegram-post.entity';
import { LogsService } from '../otherServices/logger.service';
import { RedisService } from '../redis/redis.service';
import { WordsSearchTgModule } from '../AllCategoriesForSearch/words-search-tg/words-search-tg.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([TelegramPostEntity]),
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
    WordsSearchTgModule,
  ],
  controllers: [TelegramPostsController],
  providers: [
    TelegramPostsService,
    LogsService,
    RedisService,
    RepositoryPostsAdd,
  ],
  exports: [TelegramPostsService],
})
export class TelegramPostsModule {}
