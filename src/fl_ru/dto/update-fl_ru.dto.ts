import { PartialType } from '@nestjs/mapped-types';
import { CreateFlRuDto } from './create-fl_ru.dto';

export class UpdateFlRuDto extends PartialType(CreateFlRuDto) {}
