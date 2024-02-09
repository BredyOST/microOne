import { PostEntity } from '../../../posts/entities/post.entity';
import {Entity} from "typeorm";

@Entity('realtors')
export class RealtorEntity extends PostEntity{}
