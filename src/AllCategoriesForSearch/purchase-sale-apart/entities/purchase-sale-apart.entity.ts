import { Entity } from 'typeorm';
import { PostEntity } from '../../../posts/entities/post.entity';


@Entity('purchaseSaleApart')
export class PurchaseSaleApartEntity extends PostEntity{}
