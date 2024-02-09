import { PostEntity } from '../../../posts/entities/post.entity';
import {Entity} from "typeorm";

@Entity('lawyers')
export class LawyerEntity extends PostEntity{}
