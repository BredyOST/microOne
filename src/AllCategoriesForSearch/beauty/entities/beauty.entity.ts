import { PostEntity } from "../../../posts/entities/post.entity";
import { Entity } from "typeorm";

@Entity('Beauty')
export class BeautyEntity extends PostEntity {}
