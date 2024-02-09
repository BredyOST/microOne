import { PostEntity } from '../../../posts/entities/post.entity';
import {Entity} from "typeorm";

@Entity('seo')
export class SeoEntity extends PostEntity{}
