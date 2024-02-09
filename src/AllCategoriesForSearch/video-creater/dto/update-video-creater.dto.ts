import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoCreaterDto } from './create-video-creater.dto';

export class UpdateVideoCreaterDto extends PartialType(CreateVideoCreaterDto) {}
