import { PartialType } from '@nestjs/mapped-types';
import { CreateItWebDto } from './create-it-web.dto';

export class UpdateItWebDto extends PartialType(CreateItWebDto) {}
