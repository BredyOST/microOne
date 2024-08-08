import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { PostEntity } from './entities/post.entity';
import * as process from 'process';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { LogsService } from '../otherServices/logger.service';
import { RedisService } from '../redis/redis.service';
import { TutorsService } from '../AllCategoriesForSearch/tutors/tutors.service';
import { NanniesService } from '../AllCategoriesForSearch/nannies/nannies.service';
import { HandymanAndBuilderService } from '../AllCategoriesForSearch/handyman-and-builder/handyman-and-builder.service';
import { PurchaseSaleApartService } from '../AllCategoriesForSearch/purchase-sale-apart/purchase-sale-apart.service';
import { RentRentalApartService } from '../AllCategoriesForSearch/rent-rental-apart/rent-rental-apart.service';
import { EquipRepairMaintenanceService } from '../AllCategoriesForSearch/equip-repair-maintenance/equip-repair-maintenance.service';
import { LawyerService } from '../AllCategoriesForSearch/lawyer/lawyer.service';
import { ItWebService } from '../AllCategoriesForSearch/it-web/it-web.service';
import { WordsSearchService } from '../AllCategoriesForSearch/words-search/words-search.service';
import { BeautyService } from '../AllCategoriesForSearch/beauty/beauty.service';
import { DriversService } from '../AllCategoriesForSearch/drivers/drivers.service';
import { CookService } from '../AllCategoriesForSearch/cook/cook.service';
import { PsychologistsService } from '../AllCategoriesForSearch/psychologists/psychologists.service';
import { AccountantService } from '../AllCategoriesForSearch/accountant/accountant.service';
import { InternetMarketingService } from '../AllCategoriesForSearch/internet-marketing/internet-marketing.service';
import { FotoVideoCreaterService } from '../AllCategoriesForSearch/foto-video-creater/foto-video-creater.service';
import { CustomMadeFurnitureService } from '../AllCategoriesForSearch/custom-made-furniture/custom-made-furniture.service';

const Bottleneck = require('bottleneck');

const limiter = new Bottleneck({
  minTime: 1000, // минимальное время между запросами (3 запроса в секунду, чтобы избежать ошибки "Too many requests per second")
});
const limiterTwo = new Bottleneck({
  minTime: 1000, // минимальное время между запросами (3 запроса в секунду, чтобы избежать ошибки "Too many requests per second")
});

const telegramLimiter = new Bottleneck({
  maxConcurrent: 1, // Максимальное количество одновременных запросов
  minTime: 1000, // Минимальное время между запросами (в миллисекундах)
});

export class PostsService {
  // private readonly logger = new Logger(AppService.name);

  constructor(
    private logsServicePostsAdd: LogsService,
    @InjectRepository(PostEntity)
    private repository: Repository<PostEntity>,
    private readonly httpService: HttpService,
    private redisService: RedisService,
    private tutorService: TutorsService,
    private nanniesService: NanniesService,
    private handymanAndBuilderService: HandymanAndBuilderService,
    private purchaseSaleApartService: PurchaseSaleApartService,
    private rentRentalApartService: RentRentalApartService,
    private equipRepairMaintenanceService: EquipRepairMaintenanceService,
    private lawyerService: LawyerService,
    private itWebService: ItWebService,
    private wordsSearchService: WordsSearchService,
    private beautyService: BeautyService,
    private driversService: DriversService,
    private cookService: CookService,
    private psychologistsService: PsychologistsService,
    private accountantService: AccountantService,
    private internetMarketingService: InternetMarketingService,
    private fotoVideoCreaterService: FotoVideoCreaterService,
    private customMadeFurnitureService: CustomMadeFurnitureService,
  ) {}

  async getPostsFromRedis(dto) {
    try {
      const posts = await this.redisService.get(dto.str);
      return posts;
    } catch (err) {
      this.logsServicePostsAdd.error(`getPostsFromRedis`, ` ${err}`);
    }
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
  async addPostCounter(info) {
    try {
      const link = process.env['API_URL'];

      const response = await fetch(`${link}/groups-from-vk/addPostCounter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ info }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch categories. Status: ${response.status}`,
        );
      }
    } catch (err) {
      this.logsServicePostsAdd.error(`addPostCounter`, ` ${err}`);
    }
  }
  async findByIdVk(id) {
    try {
      const link = process.env['API_URL'];

      const response = await fetch(`${link}/groups-from-vk/findByIdVk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch categories. Status: ${response.status}`,
        );
      }

      const responseData = await response.json();
      return responseData;
    } catch (err) {
      this.logsServicePostsAdd.error(`findByIdVk`, ` ${err}`);
    }
  }
  async updateThis(info) {
    try {
      const link = process.env['API_URL'];

      const response = await fetch(`${link}/groups-from-vk/updateThis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ info }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch categories. Status: ${response.status}`,
        );
      }
    } catch (err) {
      this.logsServicePostsAdd.error(`updateThis`, ` ${err}`);
    }
  }

  //===========================================================================================
  async addNewPostToOtherRepositories(
    item,
    groupInfo,
    profilesInfo,
    sendMessage,
    category,
    telegramLimiter,
    word,
    categoriesStart,
    indexCommonWord,
  ) {
    try {
      // токен бота
      const tokenBot = process.env['TOKEN_BOT'];

      const categories = [
        { id: 1, name: 'Для репетиторов', service: this.tutorService },
        { id: 2, name: 'Поиск домашнего персонала', service: this.nanniesService,},
        { id: 3, name: 'Ремонт и обслуживание техники', service: this.equipRepairMaintenanceService,},
        { id: 4, name: 'Ремонт и строительство', service: this.handymanAndBuilderService,},
        { id: 5, name: 'Аренда, сдача недвижимости', service: this.rentRentalApartService,},
        { id: 6, name: 'Покупка, продажа недвижимости', service: this.purchaseSaleApartService,},
        { id: 7, name: 'Для юристов', service: this.lawyerService },
        { id: 8, name: 'IT/Web', service: this.itWebService },
        { id: 9, name: 'Красота', service: this.beautyService },
        { id: 10, name: 'Водители', service: this.driversService },
        { id: 11, name: 'Кулинария', service: this.cookService },
        { id: 12, name: 'Психологи', service: this.psychologistsService },
        { id: 13, name: 'Бухгалтерские услуги', service: this.accountantService,},
        { id: 14, name: 'Интернет маркетинг', service: this.internetMarketingService,},
        { id: 15, name: 'Фото и видеосъемка', service: this.fotoVideoCreaterService,},
        { id: 16, name: 'Мебель на заказ', service: this.customMadeFurnitureService,},
      ];

      const categoryInfo = categories.find((cat) => cat.id === category.id);

      if (!categoryInfo) return;

      if (categoryInfo) {
        if (categoryInfo.service) {
          const isSamePost = await categoryInfo.service.getPostById(item?.id);
          // console.log(item)
          if (isSamePost) return;
        }

        const positiveWords = await category?.positiveWords;
        const negativeWords = await category?.negativeWords;

        const filter = await this.filterOnePostForOthersRepositories(
          item,
          positiveWords,
          negativeWords,
        );

        if (filter) {
          await categoryInfo.service?.createFromVkDataBase(
            item,
            groupInfo,
            profilesInfo,
            'vk',
            sendMessage,
            tokenBot,
            telegramLimiter,
          );
        }
      }

      //дополнительный блок на запуск категории с одинаковыми словами

      // мастер и ремонт  - кидаем еще в категорию №4 - строительство и ремонт
      if (indexCommonWord) {
        if (
          word.word == 'мастер' ||
          word.word == 'ремонт' ||
          word.word == 'ремонтирует'
        ) {
          const categoryTwo = categoriesStart?.find(
            (category) => category?.id == 4,
          );
          this.addNewPostToOtherRepositories(
            item,
            groupInfo,
            profilesInfo,
            true,
            categoryTwo,
            telegramLimiter,
            word,
            categories,
            false,
          );
          // this.addNewPostToOtherRepositoriesTwo(item, groupInfo, profilesInfo, true, categoryTwo, telegramLimiter)
        }
      }
      // если 4 категория то и в 5 кидаем пост
      if (indexCommonWord && category.id == 5) {
        const categoryTwo = categoriesStart?.find(
          (category) => category?.id == 6,
        );
        this.addNewPostToOtherRepositories(
          item,
          groupInfo,
          profilesInfo,
          true,
          categoryTwo,
          telegramLimiter,
          word,
          categories,
          false,
        );
      }
      if (word.word == 'мастер') {
        const categoryTwo = categoriesStart?.find(
          (category) => category?.id == 9,
        );
        this.addNewPostToOtherRepositories(
          item,
          groupInfo,
          profilesInfo,
          true,
          categoryTwo,
          telegramLimiter,
          word,
          categories,
          false,
        );
      }
    } catch (err) {
      await this.logsServicePostsAdd.error(
        `addNewPostToOtherRepositories - ошибка`,
        `${err}`,
      );
    }
  }

  async addNewPostToOtherRepositoriesTwo(
    item,
    groupInfo,
    profilesInfo,
    sendMessage,
    category,
    telegramLimiter,
    word,
    categoriesStart,
    indexCommonWord,
  ) {
    try {
      // токен бота
      const tokenBot = process.env['TOKEN_BOT'];

      const categories = [
        { id: 1, name: 'Для репетиторов', service: this.tutorService },
        {
          id: 2,
          name: 'Поиск домашнего персонала',
          service: this.nanniesService,
        },
        {
          id: 3,
          name: 'Ремонт и обслуживание техники',
          service: this.equipRepairMaintenanceService,
        },
        {
          id: 4,
          name: 'Ремонт и строительство',
          service: this.handymanAndBuilderService,
        },
        {
          id: 5,
          name: 'Аренда, сдача недвижимости',
          service: this.rentRentalApartService,
        },
        {
          id: 6,
          name: 'Покупка, продажа недвижимости',
          service: this.purchaseSaleApartService,
        },
        { id: 7, name: 'Для юристов', service: this.lawyerService },
        { id: 8, name: 'IT/Web', service: this.itWebService },
        { id: 9, name: 'Красота', service: this.beautyService },
        { id: 10, name: 'Водители', service: this.driversService },
        { id: 11, name: 'Кулинария', service: this.cookService },
        { id: 12, name: 'Психологи', service: this.psychologistsService },
        {
          id: 13,
          name: 'Бухгалтерские услуги',
          service: this.accountantService,
        },
        {
          id: 14,
          name: 'Интернет маркетинг',
          service: this.internetMarketingService,
        },
        {
          id: 15,
          name: 'Фото и видеосъемка',
          service: this.fotoVideoCreaterService,
        },
        {
          id: 16,
          name: 'Мебель на заказ',
          service: this.customMadeFurnitureService,
        },
      ];

      // if(item?.text?.length >= 650 || item?.post_text?.length >= 650) return;

      const categoryInfo = categories.find((cat) => cat.id === category.id);

      if (!categoryInfo) return;

      if (categoryInfo) {
        if (categoryInfo.service) {
          const isSamePost = await categoryInfo.service.getPostById(item?.id);
          // console.log(item)
          if (isSamePost) return;
        }

        const positiveWords = await category?.positiveWords;
        const negativeWords = await category?.negativeWords;

        const filter = await this.filterOnePostForOthersRepositories(
          item,
          positiveWords,
          negativeWords,
        );

        if (filter) {
          await categoryInfo.service?.createFromVkDataBase(
            item,
            groupInfo,
            profilesInfo,
            'vk',
            sendMessage,
            tokenBot,
            telegramLimiter,
          );
        }
      }
    } catch (err) {
      await this.logsServicePostsAdd.error(
        `addNewPostToOtherRepositories - ошибка`,
        `${err}`,
      );
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

      if (post?.text?.length >= 1) postText = post?.text.toLowerCase();
      if (post?.post_text?.length >= 1)
        postText = post?.post_text.toLowerCase();

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
  async getPostKeySearch(word, ip, countPosts, access) {
    const versionVk = process.env['VERSION_VK'];
    const currentTimeUnix = Math.floor(Date.now() / 1000); // Текущее время в Unixtime
    const startOfDayUnix = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000); // Время начала текущего дня в Unixtime
    const counter = +countPosts;

    // const dataa = `https://api.vk.com/method/newsfeed.search?q=${word}&count=${counter}&latitude=-90&longitude=-180&start_time=${startOfDayUnix}&end_time=${currentTimeUnix}&fields=city,country,photo_50&access_token=${access}&v=${versionVk}&extended=1`
    try {
      const { data } = await firstValueFrom(
        // this.httpService.get<any>(`https://api.vk.com/method/newsfeed.search?q=${word}&count=${counter}&latitude=-90&longitude=-180&start_time=${startOfDayUnix}&end_time=${currentTimeUnix}&fields=city,country,photo_50&access_token=${access}&v=${versionVk}&extended=1`
        this.httpService
          .get<any>(`${ip}`, {
            headers: {
              code: `${encodeURIComponent(word)}`,
              version: versionVk,
              access: `${encodeURIComponent(access)}`,
              count: counter.toString(),
              latitude: '-90',
              longitude: '-180',
              starttime: startOfDayUnix.toString(),
              endtime: currentTimeUnix.toString(),
              fields: 'city,country,photo_50',
              extended: '1',
            },
          })
          // )
          .pipe(
            catchError((error: AxiosError) => {
              console.log(error);
              if (
                error.response &&
                'data' in error.response &&
                error.response.data != undefined
              ) {
                console.log(error);
                this.logsServicePostsAdd.error(
                  `getPostsFromVK error`,
                  `ошибка получения постов в группе ${error.response} запрос и ответ`,
                );
              }
              throw new Error(`getPostsFromVK An error happened!`);
            }),
          ),
      );

      if (!data || !data.response || typeof data.response !== 'object') {
        this.logsServicePostsAdd.error(
          `getPostsFromVK error`,
          `Неверный формат данных от VK API ${data}`,
        );
      }

      // очищаем ответ, удаляя лишнее
      if (data?.response && typeof data.response === 'object') {
        if ('execute_errors' in data.response) {
          delete data.response.execute_errors;
        }
      }
      console.log(data);
      return data.response;
    } catch (err) {
      this.logsServicePostsAdd.error(
        `getPostsFromVK error`,
        `ошибка получения постов в группе первой ${err}`,
      );
    }
  }
  async getPostKeySearchNext(word, nextRate, ip, countPosts, access) {
    const versionVk = process.env['VERSION_VK'];
    const currentTimeUnix = Math.floor(Date.now() / 1000); // Текущее время в Unixtime
    const startOfDayUnix = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000); // Время начала текущего дня в Unixtime
    const counter = +countPosts;

    try {
      // this.httpService.get<any>(`https://api.vk.com/method/newsfeed.search?q=${word}&count=${counter}&latitude=-90&longitude=-180&start_time=${startOfDayUnix}&end_time=${currentTimeUnix}&start_from=${nextRate}&fields=city,country,photo_50&access_token=${access}&v=${versionVk}&extended=1`,

      const { data } = await firstValueFrom(
        // this.httpService.get<any>(`https://api.vk.com/method/newsfeed.search?q=${word}&count=${counter}&latitude=-90&longitude=-180&start_time=${startOfDayUnix}&end_time=${currentTimeUnix}&start_from=${nextRate}&fields=city,country,photo_50&access_token=${access}&v=${versionVk}&extended=1`,
        this.httpService
          .get<any>(`${ip}`, {
            headers: {
              // 'code': `${encodeURIComponent(request)}`,
              code: `${encodeURIComponent(word)}`,
              version: versionVk,
              access: `${encodeURIComponent(access)}`,
              count: counter.toString(),
              latitude: '-90',
              longitude: '-180',
              starttime: startOfDayUnix.toString(),
              endtime: currentTimeUnix.toString(),
              fields: 'city,country,photo_50',
              extended: '1',
              startfrom: `${encodeURIComponent(nextRate)}`,
            },
          })
          // )
          .pipe(
            catchError((error: AxiosError) => {
              if (
                error.response &&
                'data' in error.response &&
                error.response.data != undefined
              ) {
                this.logsServicePostsAdd.error(
                  `getPostsFromVK error`,
                  `ошибка получения постов в группе ${error.response} запрос и ответ ${data}`,
                );
              }
              console.log(error);
              throw new Error(`getPostsFromVK An error happened! ${data} `);
            }),
          ),
      );
      if (!data || !data.response || typeof data.response !== 'object') {
        this.logsServicePostsAdd.error(
          `getPostsFromVK error`,
          `Неверный формат данных от VK API ${data}`,
        );
      }

      // очищаем ответ, удаляя лишнее
      if (data?.response && typeof data.response === 'object') {
        if ('execute_errors' in data.response) {
          delete data.response.execute_errors;
        }
      }

      return data.response;
    } catch (err) {
      this.logsServicePostsAdd.error(
        `getPostsFromVK error`,
        `ошибка получения постов в группе вторая ${err}`,
      );
    }
  }

  async getKeysRedis() {
    const keys = await this.redisService.getAllKeys('id:9-*');
    await this.redisService.deleteKeysByPattern('id:9-*');
    return keys;
  }
  async getRedisPosts() {
    try {
      const memoryUse = await this.redisService.getMemoryInfo();
      const usedMemoryHuman = parseFloat(memoryUse?.used_memory_human);
      const maxMemoryHuman = parseFloat(memoryUse?.maxmemory_human);
      const percent = (+usedMemoryHuman * 100) / +maxMemoryHuman >= 60;

      if (percent) {
        const categories = [
          { id: 1, name: 'Для репетиторов', service: this.tutorService },
          {
            id: 2,
            name: 'Поиск домашнего персонала',
            service: this.nanniesService,
          },
          {
            id: 3,
            name: 'Ремонт и обслуживание техники',
            service: this.equipRepairMaintenanceService,
          },
          {
            id: 4,
            name: 'Ремонт и строительство',
            service: this.handymanAndBuilderService,
          },
          {
            id: 5,
            name: 'Аренда, сдача недвижимости',
            service: this.rentRentalApartService,
          },
          {
            id: 6,
            name: 'Покупка, продажа недвижимости',
            service: this.purchaseSaleApartService,
          },
          { id: 7, name: 'Для юристов', service: this.lawyerService },
          { id: 8, name: 'IT/Web', service: this.itWebService },
          { id: 9, name: 'Красота', service: this.beautyService },
          { id: 10, name: 'Водители', service: this.driversService },
          { id: 11, name: 'Кулинария', service: this.cookService },
          { id: 12, name: 'Психологи', service: this.psychologistsService },
          {
            id: 13,
            name: 'Бухгалтерские услуги',
            service: this.accountantService,
          },
          {
            id: 14,
            name: 'Интернет маркетинг',
            service: this.internetMarketingService,
          },
          {
            id: 15,
            name: 'Фото и видеосъемка',
            service: this.fotoVideoCreaterService,
          },
          {
            id: 16,
            name: 'Мебель на заказ',
            service: this.customMadeFurnitureService,
          },
        ];

        categories.forEach((item) => {
          if(item.id == 1) {
            item.service.deleteOldPosts(3500);
          }
        });

      }
    } catch (err) {
      console.log(err);
    }
  }
  async processGroup(category, ip, ipTwo, word, categories, access) {
    //category - одна категория

    try {
      if (word?.id && category?.id && ip?.ip && ipTwo?.ipTwo) return;

      let nextRate; // для перебора следующей страницы во время поиска
      const counter = 20; // стартовое значение для цикла, ограничение на 1000 постов
      const countPosts = 50;
      // один объект формата {"id": 1, "idCategory": "1", "word": null, "dateLast": null, "createdAt":null,updateAt:null}
      const thisExtraWordObject = word;
      // дата последнего обновления слова
      let dateLast = null;
      let firstPostsDate = null;

      if (word?.dateLast) {
        dateLast = new Date(word?.dateLast).getTime() / 1000;
      }
      // тут сохраняем дату на период перебора чтобы потом обновить дату в базе данных по конкретному слову
      let saveDateLastPostWhenSearching;

      if (!dateLast) {
        const currentDate = new Date();
        currentDate.setHours(0, 1, 0, 0);
        const unixTime = Math.floor(currentDate.getTime() / 1000); // Преобразование текущей даты и времени в Unixtime (в секундах)
        dateLast = unixTime;
      }

      cycle: for (let i = 0; i <= counter; i++) {
        // console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!! ${i}`)
        let result;

        if (i >= 1) {
          result = await limiter.schedule(() =>
            this.getPostKeySearchNext(
              word.word,
              nextRate,
              ipTwo,
              countPosts,
              access,
            ),
          );
          nextRate = result?.next_from;
        }

        if (i == 0) {
          result = await limiter.schedule(() =>
            this.getPostKeySearch(word.word, ip, countPosts, access),
          );
          nextRate = result?.next_from;
        }

        if (!result?.items || result?.items?.length < 1) break;

        for (let o = 0; o <= result?.items?.length; o++) {
          const item = result?.items?.[o];
          // console.log(item)
          if (
            firstPostsDate &&
            firstPostsDate == new Date(item?.date * 1000).getTime()
          ) {
            if (saveDateLastPostWhenSearching && thisExtraWordObject) {
              thisExtraWordObject.dateLast = saveDateLastPostWhenSearching;
              thisExtraWordObject.updateAt = saveDateLastPostWhenSearching;
              if (saveDateLastPostWhenSearching.getTime() > dateLast)
                this.wordsSearchService.update(thisExtraWordObject);
              break cycle;
            }
          }
          if (!dateLast) break cycle;

          // если есть дата последнего поста в бд то проверяем пост проходит или нет
          if (dateLast) {
            if (new Date(item?.date * 1000).getTime() > dateLast) {
              this.addNewPostToOtherRepositories(
                item,
                result.groups,
                result.profiles,
                true,
                category,
                telegramLimiter,
                word,
                categories,
                true,
              );
              if (!saveDateLastPostWhenSearching)
                saveDateLastPostWhenSearching = new Date(item?.date * 1000);
              if (!firstPostsDate)
                firstPostsDate = new Date(item?.date * 1000).getTime();
              if (i == counter) {
                if (saveDateLastPostWhenSearching && thisExtraWordObject) {
                  thisExtraWordObject.dateLast = saveDateLastPostWhenSearching;
                  thisExtraWordObject.updateAt = saveDateLastPostWhenSearching;
                  if (saveDateLastPostWhenSearching.getTime() > dateLast)
                    this.wordsSearchService.update(thisExtraWordObject);
                  break cycle;
                }
              }
            }

            if (new Date(item?.date * 1000).getTime() < dateLast) {
              if (saveDateLastPostWhenSearching && thisExtraWordObject) {
                thisExtraWordObject.dateLast = saveDateLastPostWhenSearching;
                thisExtraWordObject.updateAt = saveDateLastPostWhenSearching;
                if (saveDateLastPostWhenSearching.getTime() > dateLast)
                  this.wordsSearchService.update(thisExtraWordObject);
                break cycle;
              }
            }

            if (i == counter) {
              if (saveDateLastPostWhenSearching && thisExtraWordObject) {
                thisExtraWordObject.dateLast = saveDateLastPostWhenSearching;
                thisExtraWordObject.updateAt = saveDateLastPostWhenSearching;
                if (saveDateLastPostWhenSearching.getTime() > dateLast)
                  this.wordsSearchService.update(thisExtraWordObject);
                break cycle;
              }
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
      this.logsServicePostsAdd.error(
        `№1 ERROR - ${err.message}`,
        `Ошибка на ШАГЕ №1: ${err.stack}`,
      );
    }
  }
}
