import { Entity } from "typeorm";
import { PostEntity } from '../../../posts/entities/post.entity';

@Entity('psyhologists')
export class PsychologistEntity extends PostEntity{}
