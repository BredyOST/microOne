import { Controller, Get} from '@nestjs/common';
import { HandymanAndBuilderService } from '../handyman-and-builder/handyman-and-builder.service';
import { Cron } from '@nestjs/schedule';
import {EquipRepairMaintenanceService} from "./equip-repair-maintenance.service";

@Controller('equip-repair-maintenance')
export class EquipRepairMaintenanceController {
  constructor(
      private readonly handymanAndBuilderService: EquipRepairMaintenanceService
  ) {}
  @Cron('0 */5 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.handymanAndBuilderService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.handymanAndBuilderService.getAll()
  }
}
