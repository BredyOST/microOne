import { PartialType } from '@nestjs/mapped-types';
import { CreateWordsSearchTgDto } from './create-words-search-tg.dto';

export class UpdateWordsSearchTgDto extends PartialType(CreateWordsSearchTgDto) {}
