import { PostEntity } from '../../../posts/entities/post.entity';
import { Entity } from 'typeorm';

@Entity('lawyer')
export class LawyerEntity extends PostEntity {}
