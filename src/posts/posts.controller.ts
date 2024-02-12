import { Controller, Get, Post, Body } from '@nestjs/common'
import { PostsService } from './posts.service'
import { Cron } from '@nestjs/schedule';
import {serverConfig} from "./serverConfig";
@Controller('posts')
export class PostsController {

  constructor(private readonly postsService: PostsService) {}

  // БЛОК ДЛЯ ВК
  // ----------------------------------------------------------
  //добавление постов новой группы
  // @Cron('0 */10 * * * *')
  @Get('/createGroupsVk')
  createGroupsVk() {
    // return this.postsService.processGroups(`1`, 1000, 7000, false)
  }

  // обновление постов
  @Cron('0 */10 * * * *')
  @Get('/addNewPosts')
  addNewPostsVk() {
    if(serverConfig?.servers?.length >= 1 ){
      const countPosts = 1500;
      let pass = 0;
      let stepPass= 1000;
      const end = 11000;
      for (let i = 1; pass <= end; i++) {
        if(pass > end) break;
        serverConfig?.servers?.map((item) => {
          // console.log(item)
          this.postsService.processGroups(`2`, countPosts, pass, false, item.ip);
          // console.log(`${countPosts} ${pass}`)
          pass += countPosts;
          // this.postsService.processGroups(`2`, 10, 0, false);
        });
      }
    }
  }
  //
  // @Get('/test')
  // async test() {
  //   return 'test'
  // }

  @Get('/createPostsForNewCategory')
  async createPostsForNewCategory(){
    // await this.postsService.processGroups(`1`, 100, 0, true)
  }


  @Get('/getcomments')
  async getComments(){
    await this.postsService.getComments()
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
  @Get('/getRedisPosts')
  async getRedisPosts() {
    return this.postsService.getRedisPosts()
  }

}
