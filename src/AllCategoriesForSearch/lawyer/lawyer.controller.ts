import { Controller, Get} from '@nestjs/common';
import { LawyerService } from './lawyer.service';
import { Cron } from '@nestjs/schedule';

@Controller('lawyer')
export class LawyerController {
  constructor(private readonly lawyerService: LawyerService) {}
  @Cron('0 */5 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.lawyerService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.lawyerService.getAll()
  }
}
