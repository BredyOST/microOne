import {Controller, Get} from '@nestjs/common';
import { TelegramPostsService } from './telegram-posts.service';
import {serverConfig} from "../posts/serverConfig";
import * as process from 'process';
import {WordsSearchTgService} from "../AllCategoriesForSearch/words-search-tg/words-search-tg.service";
import {Cron} from "@nestjs/schedule";

@Controller('telegram-posts')
export class TelegramPostsController {
  constructor(
      private readonly telegramPostsService: TelegramPostsService,
      private readonly wordsSearchTgService: WordsSearchTgService
  ) {}
  @Get('/createGroupsTg')
  createGroupsVk() {
       this.telegramPostsService.getLogIn()
  }
  //добавление постов новой группы
  // @Cron('0 */10 * * * *')

  @Get('/createGroupsTgPosts')
  async createGroups() {

  const categories = await this.telegramPostsService.getCategories()
  const words = await this.wordsSearchTgService.findAll()

  if (!categories || categories?.length < 1) {
      return;
  }
  if (!words || words?.length < 1) {
      return;
  }
    const nextCategory = categories?.filter((item) => !item.disabled)
    // количество серверов
    const endLengthServer = serverConfig?.servers?.length
    // количество слов
    const endWordsLength = words?.length
    // старт перебора слов
    let indexSearch = 0;

    for (let i = 0; i < endWordsLength; i++) {

      const word = words[i]

      const category = nextCategory?.find((category) => category?.id == word?.idCategory)
      const server = serverConfig?.servers[indexSearch]

      if(indexSearch < endLengthServer) {
        indexSearch++
      }
      if(indexSearch == endLengthServer) {
        indexSearch = 0
      }

      if(word?.id && category?.id && server?.ip && server?.ipTwo) {
        this.telegramPostsService.processGroups(category, server?.ip, server?.ipTwo, word)
      }
    }
  }

  // обновление постов
  // @Cron('0 */10 * * * *')
  @Get('/addNewPosts')
  addNewPostsVk() {
    if(serverConfig?.servers?.length >= 1 ){
      const countPosts = process.env['COUNTER_POSTS_TG'];
      let pass = 0;
      const end = process.env['SEARCH_END_TG'];
      // for (let i = 1; pass <= +end; i++) {
        console.log(pass <= +end)
        // if(+pass > +end) break;
        serverConfig?.servers?.map((item) => {
          if(+pass > +end) return;
          // this.telegramPostsService.processGroups(`2`, countPosts, pass, false, item.ip);
          // pass += +countPosts;
        });
      // }
    }
  }

  // @Get('/createPostsForNewCategory')
  // async createPostsForNewCategory(){
  //   if(serverConfig?.servers?.length >= 1 ){
  //     const countPosts = process.env['COUNTER_POSTS'];
  //     let pass = 0;
  //     const end = process.env['SEARCH_END'];
  //
  //     for (let i = 1; pass <= +end; i++) {
  //       if(+pass > +end) break;
  //       serverConfig?.servers?.map((item) => {
  //         if(+pass > +end) return;
  //
  //         this.telegramPostsService.processGroups(`1`, countPosts, pass, true, item.ip)
  //         pass += +countPosts;
  //       });
  //     }
  //   }
  // }



}
