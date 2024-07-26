import {Controller, Get} from '@nestjs/common';
import { CustomMadeFurnitureService } from './custom-made-furniture.service';
import {Cron} from "@nestjs/schedule";

@Controller('custom-made-furniture')
export class CustomMadeFurnitureController {
  
  constructor(
    private readonly customMadeFurnitureService: CustomMadeFurnitureService,
  ) {}

  @Cron('0 */5 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.customMadeFurnitureService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.customMadeFurnitureService.getAll()
  }
}
