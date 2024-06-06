import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { PostEntity } from './posts/entities/post.entity';
import { LogsModule } from './otherServices/logger.module';
import { TutorEntity } from './AllCategoriesForSearch/tutors/entities/tutor.entity';
import { NannyEntity } from './AllCategoriesForSearch/nannies/entities/nanny.entity';
import { TutorsModule } from './AllCategoriesForSearch/tutors/tutors.module';
import { NanniesModule } from './AllCategoriesForSearch/nannies/nannies.module';
import { HandymanAndBuilderModule } from './AllCategoriesForSearch/handyman-and-builder/handyman-and-builder.module';
import { HandymanAndBuilderEntity } from './AllCategoriesForSearch/handyman-and-builder/entities/handyman-and-builder.entity';
import { EquipRepairMaintenanceEntity } from './AllCategoriesForSearch/equip-repair-maintenance/entities/equip-repair-maintenance.entity';
import { EquipRepairMaintenanceModule } from './AllCategoriesForSearch/equip-repair-maintenance/equip-repair-maintenance.module';
import { RentRentalApartEntity } from './AllCategoriesForSearch/rent-rental-apart/entities/rent-rental-apart.entity';
import { RentRentalApartModule } from './AllCategoriesForSearch/rent-rental-apart/rent-rental-apart.module';
import { PurchaseSaleApartEntity } from './AllCategoriesForSearch/purchase-sale-apart/entities/purchase-sale-apart.entity';
import { PurchaseSaleApartModule } from './AllCategoriesForSearch/purchase-sale-apart/purchase-sale-apart.module';
import { LawyerEntity } from './AllCategoriesForSearch/lawyer/entities/lawyer.entity';
import { LawyerModule } from './AllCategoriesForSearch/lawyer/lawyer.module';
import { CitiesModule } from './cities/cities.module';
import { CityEntity } from './cities/entities/city.entity';
import { ItWebEntity } from './AllCategoriesForSearch/it-web/entities/it-web.entity';
import { ItWebModule } from './AllCategoriesForSearch/it-web/it-web.module';
import { TelegramPostsModule } from './telegram-posts/telegram-posts.module';
import { TelegramPostEntity } from './telegram-posts/entities/telegram-post.entity';
import { WordSearchEntity } from './AllCategoriesForSearch/words-search/entities/words-search.entity';
import { WordsSearchModule } from './AllCategoriesForSearch/words-search/words-search.module';
import {WordsSearchTgEntity} from "./AllCategoriesForSearch/words-search-tg/entities/words-search-tg.entity";
import {WordsSearchTgModule} from "./AllCategoriesForSearch/words-search-tg/words-search-tg.module";
import { BeautyEntity } from "./AllCategoriesForSearch/beauty/entities/beauty.entity";
import { BeautyModule } from "./AllCategoriesForSearch/beauty/beauty.module";
import { DriverEntity } from "./AllCategoriesForSearch/drivers/entities/driver.entity";
import { DriversModule } from "./AllCategoriesForSearch/drivers/drivers.module";

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          synchronize: true,
          entities: [
            PostEntity,
            TutorEntity,
            NannyEntity,
            EquipRepairMaintenanceEntity,
            HandymanAndBuilderEntity,
            RentRentalApartEntity,
            PurchaseSaleApartEntity,
            LawyerEntity,
            CityEntity,
            ItWebEntity,
            TelegramPostEntity,
            WordSearchEntity,
            WordsSearchTgEntity,
            BeautyEntity,
            DriverEntity,
          ],
        };
      },
    }),
    PostsModule,
    TutorsModule,
    NanniesModule,
    LogsModule,
    HandymanAndBuilderModule,
    EquipRepairMaintenanceModule,
    RentRentalApartModule,
    PurchaseSaleApartModule,
    LawyerModule,
    CitiesModule,
    ItWebModule,
    TelegramPostsModule,
    WordsSearchModule,
    WordsSearchTgModule,
    BeautyModule,
    DriversModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
