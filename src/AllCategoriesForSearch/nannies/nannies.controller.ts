import { Controller, Get } from '@nestjs/common';
import { NanniesService } from './nannies.service'
import {Cron} from "@nestjs/schedule";
@Controller('nannies')
export class NanniesController {
  constructor(
      private readonly nanniesService: NanniesService,
  ) {}

  @Cron('0 */10 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.nanniesService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.nanniesService.getAll()
  }

}
