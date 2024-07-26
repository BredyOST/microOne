import { Entity } from 'typeorm';
import { PostEntity } from '../../../posts/entities/post.entity';

@Entity('cooks')
export class CookEntity extends PostEntity{}
