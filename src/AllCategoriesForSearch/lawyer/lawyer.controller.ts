import { Controller, Get} from '@nestjs/common';
import { LawyerService } from './lawyer.service';
import {Cron} from "@nestjs/schedule";

@Controller('lawyer')
export class LawyerController {
  constructor(
      private readonly lawyerService: LawyerService
  ) {}
  @Get('/getPostForStatic')
  async getPostForStatic() {
    return this.lawyerService.getPostForStatic()
  }
  // @Cron('0 */10 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.lawyerService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.lawyerService.getAll()
  }
}
