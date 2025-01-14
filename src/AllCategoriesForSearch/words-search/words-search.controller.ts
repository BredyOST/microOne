import { Controller, Get, Patch} from '@nestjs/common';
import { WordsSearchService } from './words-search.service';

@Controller('words')
export class WordsSearchController {
  constructor(private readonly wrdsSearchService: WordsSearchService) {}

  @Get('/getAll')
  async findAll() {
    return this.wrdsSearchService.findAll();
  }

  @Patch('/update')
  update(dto) {
    return this.wrdsSearchService.update(dto);
  }

}
