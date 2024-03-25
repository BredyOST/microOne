import { Controller, Get} from '@nestjs/common';
import { HandymanAndBuilderService } from './handyman-and-builder.service';
import {Cron} from "@nestjs/schedule";


@Controller('handyman-and-builder')
export class HandymanAndBuilderController {
  constructor(
      private readonly handymanAndBuilderService: HandymanAndBuilderService
  ) {}

  @Cron('0 */5 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.handymanAndBuilderService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.handymanAndBuilderService.getAll()
  }

}
