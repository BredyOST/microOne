import { Controller, Get } from '@nestjs/common';
import { FlRuService } from './fl_ru.service';
import { Cron } from '@nestjs/schedule';
import {PostsService} from "../posts/posts.service";

@Controller('fl-ru')
export class FlRuController {
  constructor(
      private readonly flRuService: FlRuService,
  ) {}

  @Cron('0 */5 * * * *')
  //fl.ru
  @Get('/createPosts')
  async createPosts() {

    // FLr.ru
    const linksFromFl = [
      { design: 'https://www.fl.ru/rss/all.xml?category=3', id: 8, index: 'FL' },
      { design: 'https://freelance.ru/rss/feed/list/s.40', id: 8, index: 'FR' },
    ]

    const categories = await this.flRuService.getCategories();
    const nextCategory = categories?.filter((item) => !item.disabled);

    const endWordsLength = linksFromFl.length

    for (let i = 0; i < endWordsLength; i++) {

      const thisItem = linksFromFl[i]

      const category = nextCategory?.find(
          (category) => category?.id == thisItem?.id,
      );

      this.flRuService.createPosts(thisItem, category)

    }

  }

}
