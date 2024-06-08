import { Controller, Get, Post, Body } from '@nestjs/common'
import { PostsService } from './posts.service'
import {serverConfig, serverConfigTwo} from "./serverConfig";
import {WordsSearchService} from "../AllCategoriesForSearch/words-search/words-search.service";
import {Cron} from "@nestjs/schedule";
import * as process from "process";

@Controller('posts')
export class PostsController {

  constructor(
      private readonly postsService: PostsService,
      private readonly wordsSearchService: WordsSearchService
  ) {
  }

  // ДОБАВЛЯЕМ ПОСТЫ С ВК
  @Cron('0 */10 * * * *')
  @Get('/createGroupsVk')
  async createGroupsVk() {

    const indexWords = process.env['INDEX_WORD']
    const categories = await this.postsService.getCategories()
    const words = await this.wordsSearchService.findAll()

    if (!categories || categories?.length < 1) {
      return
    }
    if (!words || words?.length < 1) {
      return
    }
    // фильтруем по индексу
    const wordNext = words.filter((item) => item?.indicator == indexWords)

    const nextCategory = categories?.filter((item) => !item.disabled)
    // количество серверов
    const endLengthServer = serverConfig?.servers?.length
    // количество слов
    const endWordsLength = wordNext?.length
    // старт перебора слов
    let indexSearch = 0;

    // -----------------------------
    const acceses = [
      { token: process.env['ACCESS_TOKEN'] },
      { token: process.env['ACCESS_TOKEN_TWO'] },
      { token: process.env['ACCESS_TOKEN_THREE'] },
      { token: process.env['ACCESS_TOKEN_FOURE'] },
    ]

    // стартовый индекс
    let indexStart = 0;
    // всего элементов в массиве
    const maxIndexSearch = acceses?.length;
    // -----------------------------

    for (let i = 0; i < endWordsLength; i++) {

      const word = wordNext[i]

      const category = nextCategory?.find((category) => category?.id == word?.idCategory)
      let server;

      if (indexWords == `1`) server = serverConfig?.servers[indexSearch];
      if (indexWords == `2`) server = serverConfigTwo?.servers[indexSearch];

      if(indexSearch < endLengthServer) {
        indexSearch++
      }
      if(indexSearch == endLengthServer) {
        indexSearch = 0
      }
      // блок обновления для acces токенов
      // если индекс больше элементов в массиве, то сбрасываем на 0
      if(indexStart == maxIndexSearch) indexStart = 0
      const access = acceses[indexStart]?.token
      indexStart++;

      if(word?.id && category?.id && server?.ip && server?.ipTwo) {
        this.postsService.processGroup(category, server?.ip, server?.ipTwo, word, nextCategory, access)
      }
    }
  }

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
}
