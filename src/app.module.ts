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
import { HandymanAndBuilderEntity } from "./AllCategoriesForSearch/handyman-and-builder/entities/handyman-and-builder.entity";
import { DesignersModule } from './AllCategoriesForSearch/designers/designers.module';
import {DesignerEntity} from "./AllCategoriesForSearch/designers/entities/designer.entity";
import {SeoModule} from "./AllCategoriesForSearch/seo/seo.module";
import {SeoEntity} from "./AllCategoriesForSearch/seo/entities/seo.entity";
import {ItModule} from "./AllCategoriesForSearch/it/it.module";
import {ItEntity} from "./AllCategoriesForSearch/it/entities/it.entity";
import {VideoCreaterEntity} from "./AllCategoriesForSearch/video-creater/entities/video-creater.entity";
import {VideoCreaterModule} from "./AllCategoriesForSearch/video-creater/video-creater.module";
import {RealtorEntity} from "./AllCategoriesForSearch/realtor/entities/realtor.entity";
import {RealtorModule} from "./AllCategoriesForSearch/realtor/realtor.module";
import {LawyerEntity} from "./AllCategoriesForSearch/lawyer/entities/lawyer.entity";
import {LawyerModule} from "./AllCategoriesForSearch/lawyer/lawyer.module";
import {DriverEntity} from "./AllCategoriesForSearch/driver/entities/driver.entity";
import {DriverModule} from "./AllCategoriesForSearch/driver/driver.module";

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
            HandymanAndBuilderEntity,
            DesignerEntity,
            SeoEntity,
            ItEntity,
            VideoCreaterEntity,
            RealtorEntity,
            LawyerEntity,
            DriverEntity,
          ],
        };
      },
    }),
    PostsModule,
    TutorsModule,
    NanniesModule,
    HandymanAndBuilderModule,
    LogsModule,
    DesignersModule,
    DesignersModule,
    SeoModule,
    ItModule,
    VideoCreaterModule,
    RealtorModule,
    LawyerModule,
    DriverModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
