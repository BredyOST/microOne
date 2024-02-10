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
    // return this.postsService.processGroups(`1`, 3000, 0, false)
  }

  // обновление постов
  @Cron('0 */10 * * * *')
  @Get('/addNewPosts')
  addNewPostsVk() {
    console.log(1)
    if(serverConfig?.servers?.length >= 1 ){
      console.log(serverConfig)
      serverConfig?.servers?.map((item) => {
        this.postsService.processGroups(`2`, 3500, 3000, false, item.ip)
      })
    }
  }

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
