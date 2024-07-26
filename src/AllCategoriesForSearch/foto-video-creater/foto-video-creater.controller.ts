import { Controller, Get } from '@nestjs/common';
import { FotoVideoCreaterService } from './foto-video-creater.service';
import { Cron } from '@nestjs/schedule';

@Controller('foto-video-creater')
export class FotoVideoCreaterController {
  constructor(
    private readonly fotoVideoCreaterService: FotoVideoCreaterService,
  ) {}

  @Cron('0 */5 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.fotoVideoCreaterService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.fotoVideoCreaterService.getAll()
  }

}
