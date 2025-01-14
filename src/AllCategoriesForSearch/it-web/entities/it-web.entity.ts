import {Entity} from "typeorm";
import {PostEntity} from "../../../posts/entities/post.entity";

@Entity('itWeb')
export class ItWebEntity extends PostEntity {}
