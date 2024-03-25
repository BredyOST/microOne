import { Controller, Get} from '@nestjs/common';
import { RentRentalApartService } from './rent-rental-apart.service';
import {Cron} from "@nestjs/schedule";

@Controller('rent-rental-apart')
export class RentRentalApartController {
  constructor(
      private readonly rentRentalApartService: RentRentalApartService
  ) {}
  @Cron('0 */5 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.rentRentalApartService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.rentRentalApartService.getAll()
  }
}
