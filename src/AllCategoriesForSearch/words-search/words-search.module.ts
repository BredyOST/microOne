import { Module } from '@nestjs/common';
import { WordsSearchService } from './words-search.service';
import { WordsSearchController } from './words-search.controller';
import {HttpModule} from "@nestjs/axios";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ScheduleModule} from "@nestjs/schedule";
import {ConfigModule} from "@nestjs/config";
import {WordSearchEntity} from "./entities/words-search.entity";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([WordSearchEntity]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
  ],
  controllers: [WordsSearchController],
  providers: [WordsSearchService],
  exports:[WordsSearchService]
})
export class WordsSearchModule {}
