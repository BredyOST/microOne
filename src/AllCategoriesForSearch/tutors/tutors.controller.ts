import {Controller, Get, Post} from '@nestjs/common';
import { TutorsService } from './tutors.service';
import {Cron} from "@nestjs/schedule";
// import process from "process";
import * as process from "process";
import Bottleneck from "bottleneck";
@Controller('tutors')

export class TutorsController {
  constructor(
      private readonly tutorsService: TutorsService,
  ) {}
  // для статики - 50 постов
  @Get('/getPostForStatic')
  async getPostForStatic() {
    return this.tutorsService.getPostForStatic()
  }
  @Cron('0 */5 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.tutorsService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.tutorsService.getAll()
  }

  // @Get('/test')
  // async send() {
  // console.log('2')
  //   const item = {
  //     date: new Date(),
  //     signer_id: '2111',
  //     from_id: '12321213',
  //     id: '1',
  //     text: 'kasdklasdklas askd aklsdjklasj 2 класс',
  //   }
  //   const tokenBot = process.env['TOKEN_BOT'];
  //   const telegramLimiter = new Bottleneck({
  //     maxConcurrent: 1, // Максимальное количество одновременных запросов
  //     minTime: 10000, // Минимальное время между запросами (в миллисекундах)
  //   });
  //   return this.tutorsService.sendPostToTelegram(
  //     item,
  //     tokenBot,
  //     telegramLimiter,
  //   );
  // }

}
