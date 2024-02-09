import { PostEntity } from '../../../posts/entities/post.entity';
import {Entity} from "typeorm";


@Entity('designers')
export class DesignerEntity extends PostEntity{}
