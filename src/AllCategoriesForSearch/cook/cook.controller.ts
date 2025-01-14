import { Controller, Get } from '@nestjs/common';
import { CookService } from './cook.service';
import { Cron } from '@nestjs/schedule';

@Controller('cook')
export class CookController {
  constructor(private readonly cookService: CookService) {}
  @Cron('0 */5 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.cookService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.cookService.getAll()
  }

}
