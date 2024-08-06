import {Controller, Get} from '@nestjs/common';
import { TutorsService } from './tutors.service';
import {Cron} from "@nestjs/schedule";

@Controller('tutors')

export class TutorsController {
  constructor(
      private readonly tutorsService: TutorsService,
  ) {}

  @Cron('0 */5 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.tutorsService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.tutorsService.getAll()
  }

  // @Get('/checkComments')
  // async checkComments() {
  //   return this.tutorsService.checkComments()
  // }
}
