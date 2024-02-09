import { PartialType } from '@nestjs/mapped-types';
import { CreateItDto } from './create-it.dto';

export class UpdateItDto extends PartialType(CreateItDto) {}
