import { Controller, Get} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EquipRepairMaintenanceService } from './equip-repair-maintenance.service';

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
