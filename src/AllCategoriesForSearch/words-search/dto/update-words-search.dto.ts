import { PartialType } from '@nestjs/mapped-types';
import { CreateWordsSearchDto } from './create-words-search.dto';

export class UpdateWordsSearchDto extends PartialType(CreateWordsSearchDto) {}
