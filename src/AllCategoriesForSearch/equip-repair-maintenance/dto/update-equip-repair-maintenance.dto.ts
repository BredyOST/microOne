import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipRepairMaintenanceDto } from './create-equip-repair-maintenance.dto';

export class UpdateEquipRepairMaintenanceDto extends PartialType(CreateEquipRepairMaintenanceDto) {}
