import { Controller, Get, Post, Body } from '@nestjs/common'
import { PostsService } from './posts.service'
import {serverConfig} from "./serverConfig";
import * as process from "process";
import {Cron} from "@nestjs/schedule";

@Controller('posts')
export class PostsController {

  constructor(private readonly postsService: PostsService) {}

  // БЛОК ДЛЯ ВК
  // ----------------------------------------------------------
  //добавление постов новой группы
  // @Cron('0 */10 * * * *')
  @Get('/createGroupsVk')
  createGroupsVk() {
    if(serverConfig?.servers?.length >= 1 ){
      const countPosts = process.env['COUNTER_POSTS'];
      let pass = 0;
      const end = process.env['SEARCH_END'];

      for (let i = 1; pass <= +end; i++) {
        if(+pass > +end) break;
        serverConfig?.servers?.map((item) => {
          if(+pass > +end) return;
          this.postsService.processGroups(`1`, countPosts, pass, false, item.ip)
          pass += +countPosts;
        });
      }
    }
  }

  // обновление постов
  @Cron('0 */10 * * * *')
  @Get('/addNewPosts')
  addNewPostsVk() {
    if(serverConfig?.servers?.length >= 1 ){
      const countPosts = process.env['COUNTER_POSTS'];
      let pass = 0;
      const end = process.env['SEARCH_END'];

      for (let i = 1; pass <= +end; i++) {
        if(+pass > +end) break;
        serverConfig?.servers?.map((item) => {
          if(+pass > +end) return;
          this.postsService.processGroups(`2`, countPosts, pass, false, item.ip);
          pass += +countPosts;
        });
      }
    }
  }

  @Get('/createPostsForNewCategory')
  async createPostsForNewCategory(){
    if(serverConfig?.servers?.length >= 1 ){
      const countPosts = process.env['COUNTER_POSTS'];
      let pass = 0;
      const end = process.env['SEARCH_END'];
      for (let i = 1; pass <= +end; i++) {
        if(+pass > +end) break;
        serverConfig?.servers?.map((item) => {
          if(+pass > +end) return;
          this.postsService.processGroups(`1`, countPosts, pass, true, item.ip)
          pass += +countPosts;
        });
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
