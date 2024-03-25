import { Controller, Get} from '@nestjs/common';
import { PurchaseSaleApartService } from './purchase-sale-apart.service';
import {Cron} from "@nestjs/schedule";

@Controller('purchase-sale-apart')
export class PurchaseSaleApartController {
  constructor(
      private readonly purchaseSaleApartService: PurchaseSaleApartService
  ) {}

  @Cron('0 */10 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.purchaseSaleApartService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.purchaseSaleApartService.getAll()
  }

}
