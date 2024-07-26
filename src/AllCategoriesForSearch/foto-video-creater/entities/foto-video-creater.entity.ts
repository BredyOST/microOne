import { Entity } from 'typeorm';
import { PostEntity } from '../../../posts/entities/post.entity';

@Entity('foto-video-creater')
export class FotoVideoCreaterEntity extends PostEntity{}
