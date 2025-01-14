import { PostEntity } from '../../../posts/entities/post.entity';
import { Entity } from 'typeorm';

@Entity('accountant')
export class AccountantEntity extends PostEntity{}
