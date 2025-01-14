import { Controller, Get } from '@nestjs/common';
import { PsychologistsService } from './psychologists.service';
import { Cron } from "@nestjs/schedule";

@Controller('psychologists')
export class PsychologistsController {
  constructor(private readonly psychologistsService: PsychologistsService) {}

  @Cron('0 */10 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.psychologistsService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.psychologistsService.getAll()
  }
}
