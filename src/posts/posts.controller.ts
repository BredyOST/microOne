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
    serverConfig.servers.map((item) => {
      this.postsService.processGroups(`1`, 3000, 0, false, item.ip, item.port);
    })
  }

  // обновление постов
  @Cron('0 */10 * * * *')
  @Get('/addNewPosts')
  addNewPostsVk() {
    serverConfig.servers.map((item) => {
      this.postsService.processGroups(`2`, 4000, 0, false, item.ip, item.port)
    })
  }

  @Get('/createPostsForNewCategory')
  async createPostsForNewCategory(){
    serverConfig.servers.map((item) => {
      this.postsService.processGroups(`1`, 100, 0, true, item.ip, item.port);
    })
  }


  @Get('/getcomments')
  async getComments(){
    this.postsService.getComments()
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
