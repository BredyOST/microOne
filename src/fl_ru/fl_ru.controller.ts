import { Controller, Get } from '@nestjs/common';
import { FlRuService } from './fl_ru.service';
import { Cron } from '@nestjs/schedule';
import {PostsService} from "../posts/posts.service";
import process from "process";

@Controller('fl-ru')
export class FlRuController {
  constructor(
      private readonly flRuService: FlRuService,
  ) {}

  @Cron('0 */5 * * * *')
  //fl.ru
  @Get('/createPosts')
  async createPosts() {

    const indexWords = process.env['INDEX_WORD'];
    // FLr.ru
    const linksFromFl = [
      { design: 'https://www.fl.ru/rss/all.xml?category=3', id: 8, index: 'FL', indexSearch: 1},
      { design: 'https://freelance.ru/rss/feed/list/s.40', id: 8, index: 'FR', indexSearch: 2 },
    ]

    const linkNext = linksFromFl.filter((item) => +item?.indexSearch == +indexWords)

    const categories = await this.flRuService.getCategories();
    const nextCategory = categories?.filter((item) => !item.disabled);

    const endWordsLength = linkNext?.length

    for (let i = 0; i < endWordsLength; i++) {

      const thisItem = linkNext[i]

      const category = nextCategory?.find(
          (category) => category?.id == thisItem?.id,
      );

      this.flRuService.createPosts(thisItem, category)

    }

  }

}
