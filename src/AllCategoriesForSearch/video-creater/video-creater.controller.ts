import { Controller, Get } from '@nestjs/common';
import { VideoCreaterService } from './video-creater.service';
import {Cron} from "@nestjs/schedule";

@Controller('video-creater')
export class VideoCreaterController {
  constructor(
      private readonly videoCreaterService: VideoCreaterService
  ) {}
  @Get('/getPostForStatic')
  async getPostForStatic() {
    return this.videoCreaterService.getPostForStatic()
  }
  // @Cron('0 */10 * * * *')
  @Get('forRedis')
  async savePostsToRedis() {
    return this.videoCreaterService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.videoCreaterService.getAll()
  }
}
