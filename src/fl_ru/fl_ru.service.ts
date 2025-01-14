import { Injectable } from '@nestjs/common';
import * as Parser from 'rss-parser';
import {InjectRepository} from "@nestjs/typeorm";
import {FlRuEntity} from "./entities/fl_ru.entity";
import {Repository} from "typeorm";
import {LogsService} from "../otherServices/logger.service";
import {HttpService} from "@nestjs/axios";
import {RedisService} from "../redis/redis.service";
import {ItWebService} from "../AllCategoriesForSearch/it-web/it-web.service";
import * as process from 'process';

interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
}

@Injectable()
export class FlRuService {
  private parser: Parser;
  constructor(
      private logsServicePostsAdd: LogsService,
      @InjectRepository(FlRuEntity)
      private repository: Repository<FlRuEntity>,
      private readonly httpService: HttpService,
      private redisService: RedisService,
      private itWebService: ItWebService,
  ) {
    this.parser = new Parser();
  }

  //===========================================================================================
  // запрос на другой сервер (основной)
  async getCategories() {
    try {

      const link = process.env['API_URL'];

      const response = await fetch(`${link}/categories/getAll`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(
            `Failed to fetch categories. Status: ${response.status}`,
        );
      }

      const responseData = await response.json();
      return responseData;
    } catch (err) {
      this.logsServicePostsAdd.error(`getCategories`, ` ${err}`);
    }
  }

  async createPosts(linksFromFl, category) {

    try {
      console.log(linksFromFl.design)
      const categories = [
        { id: 8, name: 'IT/Web', service: this.itWebService },
      ];

      const categoryInfo = categories.find((cat) => cat.id === category.id);
      const feed = await this.parser.parseURL(linksFromFl.design);
      // console.log(feed)

      if (!categoryInfo || !feed?.items?.length) return;

      for (let item of feed?.items) {
        console.log(item)
        const link = item?.link
        const idMatch = link.match(/projects\/(\d+)\//);
        const projectId = idMatch ? idMatch[1] : null;

        if (categoryInfo && categoryInfo.service) {
            const isSamePost = await categoryInfo.service.getPostByIdFreelance(projectId, linksFromFl?.index);
            if (isSamePost) continue;

          const positiveWords = await category?.positiveWords;
          const negativeWords = await category?.negativeWords;

          const filter = await this.filterOnePostForOthersRepositories(
              item,
              positiveWords,
              negativeWords,
          );

          if (filter) {
            await this.itWebService.createFromFlRu(item, linksFromFl?.index)
          }
        }
      }

    } catch (err) {
      console.log(err)
    }
  }

  //№3 фильтруем пост по ключевым словам
  async filterOnePostForOthersRepositories(
      post,
      positiveKeywords,
      negativeKeywords,
  ) {
    try {
      let postText;

      if (post?.content?.length >= 1) postText = post?.content.toLowerCase();

      const containsPositiveKeyword = positiveKeywords?.some((keyword) =>
          postText?.includes(keyword),
      );
      const containsNegativeKeyword = negativeKeywords?.some((keyword) =>
          postText?.includes(keyword),
      );

      return containsPositiveKeyword && !containsNegativeKeyword;
    } catch (err) {
      await this.logsServicePostsAdd.error(
          `filterOnePostForOthersRepositories ERROR - ${err}`,
          `${err.stack}`,
      );
    }
  }
}
