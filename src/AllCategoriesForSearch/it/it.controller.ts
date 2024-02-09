import { Controller, Get } from '@nestjs/common';
import { ItService } from './it.service';
import {Cron} from "@nestjs/schedule";


@Controller('it')
export class ItController {
  constructor(
      private readonly itService: ItService
  ) {}

  @Get('/getPostForStatic')
  async getPostForStatic() {
    return this.itService.getPostForStatic()
  }
  // @Cron('0 */10 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.itService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.itService.getAll()
  }
}
