import { PostEntity } from '../../../posts/entities/post.entity';
import {Entity} from "typeorm";

@Entity('equip-repair-maintenance')
export class EquipRepairMaintenanceEntity extends PostEntity {}
