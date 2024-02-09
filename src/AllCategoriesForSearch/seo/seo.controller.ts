import { Controller, Get } from '@nestjs/common';
import { SeoService } from './seo.service';
import {Cron} from "@nestjs/schedule";

@Controller('seo')
export class SeoController {
  constructor(
      private readonly seoService: SeoService
  ) {}

  @Get('/getPostForStatic')
  async getPostForStatic() {
    return this.seoService.getPostForStatic()
  }
  // @Cron('0 */10 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.seoService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.seoService.getAll()
  }
}
