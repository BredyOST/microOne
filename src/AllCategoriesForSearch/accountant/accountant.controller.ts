import { Controller, Get} from '@nestjs/common';
import { AccountantService } from './accountant.service';
import {Cron} from "@nestjs/schedule";

@Controller('accountant')
export class AccountantController {
  constructor(private readonly accountantService: AccountantService) {}
  @Cron('0 */5 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.accountantService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.accountantService.getAll()
  }
}
