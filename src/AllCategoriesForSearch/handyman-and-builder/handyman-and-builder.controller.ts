import { Controller, Get} from '@nestjs/common';
import { HandymanAndBuilderService } from './handyman-and-builder.service';
import {Cron} from "@nestjs/schedule";


@Controller('handyman-and-builder')
export class HandymanAndBuilderController {
  constructor(
      private readonly handymanAndBuilderService: HandymanAndBuilderService
  ) {}

  // для статики - 50 постов
  @Get('/getPostForStatic')
  async getPostForStatic() {
    return this.handymanAndBuilderService.getPostForStatic()
  }
  @Cron('0 */10 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.handymanAndBuilderService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.handymanAndBuilderService.getAll()
  }

}
