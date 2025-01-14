import { PostEntity } from "../../../posts/entities/post.entity";
import { Entity } from "typeorm";

@Entity('drivers')
export class DriverEntity extends PostEntity{}
