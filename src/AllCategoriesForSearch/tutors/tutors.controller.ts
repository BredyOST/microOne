import { Controller, Get } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import {Cron} from "@nestjs/schedule";
@Controller('tutors')

export class TutorsController {
  constructor(
      private readonly tutorsService: TutorsService,
  ) {}
  // для статики - 50 постов
  @Get('/getPostForStatic')
  async getPostForStatic() {
    return this.tutorsService.getPostForStatic()
  }
  @Cron('0 */5 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.tutorsService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.tutorsService.getAll()
  }
}
