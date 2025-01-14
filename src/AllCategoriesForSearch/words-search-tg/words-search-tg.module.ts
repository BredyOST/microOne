import { Module } from '@nestjs/common';
import { WordsSearchTgService } from './words-search-tg.service';
import { WordsSearchTgController } from './words-search-tg.controller';
import {HttpModule} from "@nestjs/axios";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ScheduleModule} from "@nestjs/schedule";
import {ConfigModule} from "@nestjs/config";
import {WordsSearchTgEntity} from "./entities/words-search-tg.entity";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([WordsSearchTgEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
  ],
  controllers: [WordsSearchTgController],
  providers: [WordsSearchTgService],
  exports:[WordsSearchTgService]
})
export class WordsSearchTgModule {}
