import { Controller, Get, Post, Body } from '@nestjs/common'
import { PostsService } from './posts.service'
import {serverConfig} from "./serverConfig";
import {WordsSearchService} from "../AllCategoriesForSearch/words-search/words-search.service";
import {Cron} from "@nestjs/schedule";

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

    const categories = await this.postsService.getCategories()
    const words = await this.wordsSearchService.findAll()

    if (!categories || categories?.length < 1) {
      return
    }
    if (!words || words?.length < 1) {
      return
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
        this.postsService.processGroup(category, server?.ip, server?.ipTwo, word, nextCategory)
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

