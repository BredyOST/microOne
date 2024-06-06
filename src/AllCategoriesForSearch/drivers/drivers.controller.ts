import { Controller, Get } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { Cron } from "@nestjs/schedule";

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Cron('0 */5 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.driversService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.driversService.getAll()
  }
}
