import { Controller, Get} from '@nestjs/common';
import { ItWebService } from './it-web.service';
import {Cron} from "@nestjs/schedule";

@Controller('it-web')
export class ItWebController {
  constructor(private readonly itWebService: ItWebService) {}
  @Cron('0 */5 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.itWebService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.itWebService.getAll()
  }
}
