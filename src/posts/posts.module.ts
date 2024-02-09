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
import { DesignersModule } from '../AllCategoriesForSearch/designers/designers.module';
import { SeoModule } from '../AllCategoriesForSearch/seo/seo.module';
import { ItModule } from '../AllCategoriesForSearch/it/it.module';
import { VideoCreaterModule } from '../AllCategoriesForSearch/video-creater/video-creater.module';
import { RealtorModule } from '../AllCategoriesForSearch/realtor/realtor.module';
import { LawyerModule } from '../AllCategoriesForSearch/lawyer/lawyer.module';
import { DriverModule } from '../AllCategoriesForSearch/driver/driver.module';

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
    DesignersModule,
    DesignersModule,
    SeoModule,
    ItModule,
    VideoCreaterModule,
    RealtorModule,
    LawyerModule,
    DriverModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    LogsService,
    RedisService,
    RepositoryPostsAdd
  ],
  exports: [PostsService],
})
export class PostsModule {}
