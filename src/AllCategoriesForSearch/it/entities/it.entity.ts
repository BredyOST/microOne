import { PostEntity } from '../../../posts/entities/post.entity';
import {Entity} from "typeorm";

@Entity('it')
export class ItEntity extends PostEntity{}
