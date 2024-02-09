import { PostEntity } from '../../../posts/entities/post.entity';
import {Entity} from "typeorm";

@Entity('videoCreaters')
export class VideoCreaterEntity extends PostEntity{}
