import { Controller, Get } from '@nestjs/common';
import { InternetMarketingService } from './internet-marketing.service';
import { Cron } from '@nestjs/schedule';

@Controller('internet-marketing')
export class InternetMarketingController {
  constructor(
    private readonly internetMarketingService: InternetMarketingService,
  ) {}

  @Cron('0 */5 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.internetMarketingService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.internetMarketingService.getAll()
  }
}
