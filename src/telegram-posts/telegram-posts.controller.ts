import {Controller, Get} from '@nestjs/common';
import { TelegramPostsService } from './telegram-posts.service';
import {serverConfig} from "../posts/serverConfig";
import * as process from 'process';

@Controller('telegram-posts')
export class TelegramPostsController {
  constructor(
      private readonly telegramPostsService: TelegramPostsService
  ) {}
  @Get('/createGroupsVk')
  createGroupsVk() {
       this.telegramPostsService.getLogIn()
  }
  //добавление постов новой группы
  // @Cron('0 */10 * * * *')
  @Get('/createGroupsVkPosts')
  createGroups() {
    if(serverConfig?.servers?.length >= 1 ){
      const countPosts = process.env['COUNTER_POSTS_TG'];
      let pass = 0;
      const end = process.env['SEARCH_END_TG'];

      for (let i = 1; pass <= +end; i++) {
        if(+pass > +end) break;
        serverConfig?.servers?.map((item) => {
          if(+pass > +end) return;
          this.telegramPostsService.processGroups(`1`, countPosts, pass, false, item.ip)
          pass += +countPosts;
        });
      }
    }
  }

  // обновление постов
  // @Cron('0 */10 * * * *')
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
          this.telegramPostsService.processGroups(`2`, countPosts, pass, false, item.ip);
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

          this.telegramPostsService.processGroups(`1`, countPosts, pass, true, item.ip)
          pass += +countPosts;
        });
      }
    }
  }



}
