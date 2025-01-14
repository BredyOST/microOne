import {Controller, Get, Patch} from '@nestjs/common';
import { WordsSearchTgService } from './words-search-tg.service';


@Controller('words-search-tg')
export class WordsSearchTgController {
  constructor(private readonly wordsSearchTgService: WordsSearchTgService) {}

  @Get('/getAll')
  async findAll() {
    return this.wordsSearchTgService.findAll();
  }

  @Patch('/update')
  update(dto) {
    return this.wordsSearchTgService.update(dto);
  }

}
