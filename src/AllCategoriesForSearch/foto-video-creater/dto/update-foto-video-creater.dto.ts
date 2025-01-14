import { PartialType } from '@nestjs/mapped-types';
import { CreateFotoVideoCreaterDto } from './create-foto-video-creater.dto';

export class UpdateFotoVideoCreaterDto extends PartialType(CreateFotoVideoCreaterDto) {}
