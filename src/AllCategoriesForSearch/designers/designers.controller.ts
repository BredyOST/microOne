import { Controller, Get } from '@nestjs/common';
import { DesignersService } from './designers.service';
import {Cron} from "@nestjs/schedule";

@Controller('designers')
export class DesignersController {
  constructor(
      private readonly designersService: DesignersService
  ) {}
  @Get('/getPostForStatic')
  async getPostForStatic() {
    return this.designersService.getPostForStatic()
  }
  // @Cron('0 */10 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.designersService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.designersService.getAll()
  }

}
