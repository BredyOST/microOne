import { Controller, Get } from '@nestjs/common';
import { RealtorService } from './realtor.service';
import {Cron} from "@nestjs/schedule";

@Controller('realtor')
export class RealtorController {
  constructor(
      private readonly realtorService: RealtorService
  ) {}
  @Get('/getPostForStatic')
  async getPostForStatic() {
    return this.realtorService.getPostForStatic()
  }
  // @Cron('0 */10 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.realtorService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.realtorService.getAll()
  }

}
