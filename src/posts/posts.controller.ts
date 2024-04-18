import { Controller, Get, Post, Body } from '@nestjs/common'
import { PostsService } from './posts.service'
import {serverConfig} from "./serverConfig";
import * as process from "process";
import {WordsSearchService} from "../AllCategoriesForSearch/words-search/words-search.service";
import {Cron} from "@nestjs/schedule";

@Controller('posts')
export class PostsController {

  constructor(
      private readonly postsService: PostsService,
      private readonly wordsSearchService: WordsSearchService
  ) {
  }

  // БЛОК ДЛЯ ВК
  // ----------------------------------------------------------
  //добавление постов новой группы
  // @Cron('0 */10 * * * *')
  // @Get('/createGroupsVk')
  // createGroupsVk() {
  //   if(serverConfig?.servers?.length >= 1 ){
  //     const countPosts = process.env['COUNTER_POSTS'];
  //     let pass = 0;
  //     const end = process.env['SEARCH_END'];
  //
  //     for (let i = 1; pass <= +end; i++) {
  //       if(+pass > +end) break;
  //       serverConfig?.servers?.map((item) => {
  //         if(+pass > +end) return;
  //         this.postsService.processGroups(`1`, countPosts, pass, false, item.ip)
  //         pass += +countPosts;
  //       });
  //     }
  //   }
  // }

  // обновление постов
  // @Cron('0 */10 * * * *')
  @Get('/addNewPosts')
  addNewPostsVk() {
    if (serverConfig?.servers?.length >= 1) {
      const countPosts = process.env['COUNTER_POSTS'];
      let pass = 0;
      const end = process.env['SEARCH_END'];
      for (let i = 1; pass <= +end; i++) {
        if (+pass > +end) break;
        serverConfig?.servers?.map((item) => {
          if (+pass > +end) return;
          this.postsService.processGroups(`2`, countPosts, pass, false, item.ip);
          pass += +countPosts;
        });
      }
    }
  }

  @Get('/createPostsForNewCategory')
  async createPostsForNewCategory() {
    if (serverConfig?.servers?.length >= 1) {
      const countPosts = process.env['COUNTER_POSTS'];
      let pass = 6000;
      const end = process.env['SEARCH_END'];

      for (let i = 1; pass <= +end; i++) {
        if (+pass > +end) break;
        serverConfig?.servers?.map((item) => {
          if (+pass > +end) return;

          this.postsService.processGroups(`1`, countPosts, pass, true, item.ip)
          pass += +countPosts;
        });
      }
    }
  }

  // !!!!!!!!!!!!!!!добавление групп с вк новых!!!!!!!!!!!!!!!!!!!!!!!!!
  // @Get('/addNewPosts')
  // addNewGroupFromVk() {
  //   if(serverConfig?.servers?.length >= 1 ){
  //     const countPosts = process.env['COUNTER_POSTS'];
  //     let pass = 0;
  //     const end = process.env['SEARCH_END'];
  //     for (let i = 1; pass <= +end; i++) {
  //       if(+pass > +end) break;
  //       serverConfig?.servers?.map((item) => {
  //         if(+pass > +end) return;
  //         this.postsService.addGroupFromVk(groupsIds, item.ip);
  //         pass += +countPosts;
  //       });
  //     }
  //   }
  // }

  // ----------------------------------------------------------

  // @Cron('0 */10 * * * *')
  @Post('/getPostsRedis')
  async getPostsFromRedis(@Body() dto) {
    return this.postsService.getPostsFromRedis(dto)
  }

  @Get('/getAllKeysRedis')
  async geRedisKey() {
    return this.postsService.getKeysRedis()
  }

  // для очистки
  // @Get('/getRedisPosts')
  // async getRedisPosts() {
  //   return this.postsService.getRedisPosts()
  // }


  // СОЗДАЕМ
  @Cron('0 */10 * * * *')
  @Get('/createGroupsVk')
  async createGroupsVk() {

    const categories = await this.postsService.getCategories()
    const words = await this.wordsSearchService.findAll()

    if (!categories || categories?.length < 1) {
      return
    }
    if (!words || words?.length < 1) {
      return
    }

    const nextCategory = categories?.filter((item) => !item.disabled)
    const endLengthServer = serverConfig?.servers?.length
    const endWordsLength = words?.length
    let indexSearch = 0;

    for (let i = 0; i <= endWordsLength; i++) {

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
        this.postsService.processGroup(category, server?.ip, server?.ipTwo, word)
      }
    }
  }
}

