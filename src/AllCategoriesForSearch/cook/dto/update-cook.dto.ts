import { PartialType } from '@nestjs/mapped-types';
import { CreateCookDto } from './create-cook.dto';

export class UpdateCookDto extends PartialType(CreateCookDto) {}
