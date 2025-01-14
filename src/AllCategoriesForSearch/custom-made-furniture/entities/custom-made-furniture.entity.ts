import { Entity } from 'typeorm';
import { PostEntity } from '../../../posts/entities/post.entity';

@Entity('made-furniture')
export class CustomMadeFurnitureEntity extends PostEntity {}
