import { Controller, Get } from '@nestjs/common';
import { DriverService } from './driver.service';
import {Cron} from "@nestjs/schedule";

@Controller('driver')
export class DriverController {
  constructor(
      private readonly driverService: DriverService
  ) {}
  @Get('/getPostForStatic')
  async getPostForStatic() {
    return this.driverService.getPostForStatic()
  }
  // @Cron('0 */10 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.driverService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.driverService.getAll()
  }
}
