import { PostEntity } from '../../../posts/entities/post.entity';
import {Entity} from "typeorm";

@Entity('handymanAndBuilder')
export class HandymanAndBuilderEntity extends PostEntity {}
