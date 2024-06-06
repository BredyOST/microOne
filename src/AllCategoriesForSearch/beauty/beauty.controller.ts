import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BeautyService } from './beauty.service';
import { Cron } from "@nestjs/schedule";

@Controller('beauty')
export class BeautyController {
  constructor(private readonly beautyService: BeautyService) {}
  @Cron('0 */5 * * * *')
  @Get('/forRedis')
  async savePostsToRedis() {
    return this.beautyService.savePostsToRedis()
  }
  @Get('/all')
  async getAll() {
    return this.beautyService.getAll()
  }
}
