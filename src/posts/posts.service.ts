import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { PostEntity } from './entities/post.entity';
import * as process from 'process';
import {catchError, firstValueFrom, pipe} from 'rxjs';
import { AxiosError } from 'axios';
import { LogsService } from '../otherServices/logger.service';
import { RedisService } from '../redis/redis.service';
import { TutorsService } from '../AllCategoriesForSearch/tutors/tutors.service';
import { NanniesService } from '../AllCategoriesForSearch/nannies/nannies.service';
import { HandymanAndBuilderService } from '../AllCategoriesForSearch/handyman-and-builder/handyman-and-builder.service';
import {PurchaseSaleApartService} from "../AllCategoriesForSearch/purchase-sale-apart/purchase-sale-apart.service";
import {RentRentalApartService} from "../AllCategoriesForSearch/rent-rental-apart/rent-rental-apart.service";
import {
  EquipRepairMaintenanceService
} from "../AllCategoriesForSearch/equip-repair-maintenance/equip-repair-maintenance.service";
import {LawyerService} from "../AllCategoriesForSearch/lawyer/lawyer.service";
import {ItWebService} from "../AllCategoriesForSearch/it-web/it-web.service";

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
  async findByIdCategory(id) {
    try {
      const link = process.env['API_URL'];

      const response = await fetch(`${link}/categories/findByIdOther`, {
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
      this.logsServicePostsAdd.error(`findByIdCategory`, ` ${err}`);
    }
  }
  async getGroups(start, pass) {

    try {
      const link = process.env['API_URL'];
      const response = await fetch(`${link}/groups-from-vk/getPartOfGroup?size=${start}&offset=${pass}`, {
        method: 'GET',
      });

      // headers: {'Content-Type': 'application/json',},
      // body: JSON.stringify({ size: start, offset: pass }),

      if (!response.ok) {
        throw new Error(`Failed to fetch categories. Status: ${response.status}`,);
      }

      const responseData = await response.json();
      return responseData;

    } catch (err) {
      console.log(err)
      this.logsServicePostsAdd.error(`getGroups`, ` ${err}`);
    }
  }
  async addInfoAboutClosedGroupMain(groups: string[]) {
    try {
      const link = process.env['API_URL'];

      const response = await fetch(
        `${link}/groups-from-vk/addInfoAboutClosedGroup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ groups }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `addInfoAboutClosedGroupMain. Status: ${response.status}`,
        );
      }
    } catch (err) {
      this.logsServicePostsAdd.error(`addInfoAboutClosedGroupMain`, ` ${err}`);
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
  async updateTCategory(category) {

    try {
      const link = process.env['API_URL'];

      const response = await fetch(`${link}/categories/updateThis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category }),
      });
      console.log(response)
      // if (!response.ok) {
      //   throw new Error(
      //       `Failed to fetch categories. Status: ${response.status}`,
      //   );
      // }
    } catch (err) {
      this.logsServicePostsAdd.error(`updateThis`, ` ${err}`);
    }
  }
  async changePostsDateToDateUpdateWhenBreak(info) {
    try {
      const link = process.env['API_URL'];

      const response = await fetch(
        `${link}/groups-from-vk/changePostsDateToDateUpdateWhenBreak`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ info }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch categories. Status: ${response.status}`,
        );
      }
    } catch (err) {
      this.logsServicePostsAdd.error(
        `changePostsDateToDateUpdateWhenBreak`,
        ` ${err}`,
      );
    }
  }
  async addPostDateWhenUpdate(info) {
    try {
      const link = process.env['API_URL'];

      const response = await fetch(
        `${link}/groups-from-vk/addPostDateWhenUpdate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ info }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch categories. Status: ${response.status}`,
        );
      }
    } catch (err) {
      this.logsServicePostsAdd.error(`addPostDateWhenUpdate`, ` ${err}`);
    }
  }

  //===========================================================================================

  // Второстепенные функции при обновлении и добавлении
  // получаем посты с вк
  async getPostsFromVK(postsForRequst, ip) {

    const access = process.env['ACCESS_TOKEN'];
    const versionVk = process.env['VERSION_VK'];
    try {
      const { data } = await firstValueFrom(
          this.httpService.get<any>(`${ip}`, { headers: {
              'code': `${encodeURIComponent(postsForRequst)}`,
              'version': versionVk,
              'access': access,
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              if (
                error.response &&
                'data' in error.response &&
                error.response.data != undefined
              ) {
                this.logsServicePostsAdd.error(
                  `getPostsFromVK error`,
                  `ошибка получения постов в группе ${error.response} запрос ${postsForRequst} и ответ ${data}`,
                );
              }
              this.logsServicePostsAdd.error(
                `getPostsFromVK error`,
                `ошибка получения постов в группе ${error.response} запрос ${postsForRequst} и ответ ${data}`,
              );
              throw new Error(
                `getPostsFromVK An error happened! ${data} для ${postsForRequst}`,
              );
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

      const filteredData = { response: {} };

      filteredData.response = Object.fromEntries(
        Object.entries(data.response).filter(([key, value]: [string, any]) => {
          return (
            value !== false &&
            (!value.count || value.count !== 0) &&
            value.items &&
            value.items.length > 0
          );
        }),
      );

      return filteredData;
    } catch (err) {
      this.logsServicePostsAdd.error(
        `getPostsFromVK error`,
        `ошибка получения постов в группе ${err} запрос ${postsForRequst}`,
      );
    }
  }
  // запрос групп по id чтобы проверить закрыта группа илимн нет
  async checkIsClosedGroup(code, ip) {
    const access = process.env['ACCESS_TOKEN'];
    const versionVk = process.env['VERSION_VK'];

    try {
      const response = await firstValueFrom(
          this.httpService.get<any>(`${ip}`, { headers: {
              'code': `${encodeURIComponent(code)}`,
              'version': versionVk,
              'access': access,
            },
          })
              .pipe(
                  catchError((error: AxiosError) => {
                    if (error.response && 'data' in error.response && error.response.data != undefined) {
                      this.logsServicePostsAdd.error(
                          `checkIsClosedGroup1 error`,
                          `ошибка получения постов в группе ${error.response} код ${code}`,
                      );
                    }
                    throw new Error(`${error}`);
                  }),
              ),
      );
      if (!response) {
        this.logsServicePostsAdd.error(
            `checkIsClosedGroup4 error`,
            `Неверный формат данных от VK API ${response} запрос не успешный для ${code}`,
        );
      }
      const data = response.data;

      return data;
    } catch (err) {
      // console.error('Error:', err.request_params);
      await this.logsServicePostsAdd.error(
          `ошибка получения постов в группе проверяем ids ${new Date().toTimeString()} для ${err}`, 'ERRORS',
      );
    }
  }
  //получить город на русском
  //===========================================================================================
  // № 1разводящая функция когда появляется новый пост, направляет в другие репозитории
  async givePostsToAllRepositories(item, groupInfo, profilesInfo,category, sendMessage) {

    try {

      if (!category) return

      this.addNewPostToOtherRepositories(item, groupInfo, profilesInfo, sendMessage, category, telegramLimiter,);

      // if (!boolIndex) {
      //   await Promise.all(
      //       allCategories.map(async (category) => {
      //         if (!category?.disabled) {
      //           this.addNewPostToOtherRepositories(item, groupInfo, profilesInfo, sendMessage, category, telegramLimiter,);
      //         }
      //       }),
      //   );
      // }
      // if (boolIndex) {
      //   await Promise.all(
      //       allCategories.map(async (category) => {
      //         if (category?.create) {
      //           this.addNewPostToOtherRepositories(item, groupInfo, profilesInfo, sendMessage, category, telegramLimiter,);
      //         }
      //       }),
      //   );
      // }

    } catch (err) {
      await this.logsServicePostsAdd.error(
        `givePostsToAllRepositories ERROR - ${err.message}`,
        `Ошибка в разводящей функции ${err.stack}`,
      );
    }
  }
  // №2 проверяем
  async addNewPostToOtherRepositories(item, groupInfo, profilesInfo, sendMessage, category, telegramLimiter,) {

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
      ];

      const categoryInfo = categories.find((cat) => cat.id === category.id);

      if (!categoryInfo) return

      if (categoryInfo) {
        if (categoryInfo.service) {
          const isSamePost = await categoryInfo.service.getPostById(item?.id);
          // console.log(item)
          if (isSamePost) return;
        }

        const positiveWords = await category?.positiveWords;
        const negativeWords = await category?.negativeWords;

        const filter = await this.filterOnePostForOthersRepositories(item, positiveWords, negativeWords);

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
  async filterOnePostForOthersRepositories(post, positiveKeywords, negativeKeywords) {
    try {
      let postText;

      if (post.text.length >= 1) postText = post.text.toLowerCase();
      if (post?.post_text?.length >=1 ) postText = post.post_text.toLowerCase();

      const containsPositiveKeyword = positiveKeywords.some((keyword) =>
        postText.includes(keyword),
      );
      const containsNegativeKeyword = negativeKeywords.some((keyword) =>
        postText.includes(keyword),
      );

      return containsPositiveKeyword && !containsNegativeKeyword;

    } catch (err) {
      await this.logsServicePostsAdd.error(
        `filterOnePostForOthersRepositories ERROR - ${err}`,
        `${err.stack}`,
      );
    }
  }
  // получаем посты по ключевым словам
  async getPostKeySearch(word, ip) {
    const access = process.env['ACCESS_TOKEN'];
    const versionVk = process.env['VERSION_VK'];
    const currentTimeUnix = Math.floor(Date.now() / 1000); // Текущее время в Unixtime
    const startOfDayUnix = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000); // Время начала текущего дня в Unixtime
    const counter = 20;

    // const aa = `https://api.vk.com/method/newsfeed.search?q=${word}&count=${counter}&latitude=-90&longitude=-180&start_time=${startOfDayUnix}&end_time=${currentTimeUnix}&fields=city,country,photo_50&access_token=${access}&v=${versionVk}&extended=1`

    try {

      const { data } = await firstValueFrom(
      // this.httpService.get<any>(`https://api.vk.com/method/newsfeed.search?q=${word}&count=${counter}&latitude=-90&longitude=-180&start_time=${startOfDayUnix}&end_time=${currentTimeUnix}&fields=city,country,photo_50&access_token=${access}&v=${versionVk}&extended=1`

          this.httpService.get<any>(`${ip}`, { headers: {
              'code': `${encodeURIComponent(word)}`,
              'version':versionVk,
              'access': `${encodeURIComponent(access)}`,
              'count': counter.toString(),
              'latitude': '-90',
              'longitude': '-180',
              'starttime': startOfDayUnix.toString(),
              'endtime': currentTimeUnix.toString(),
              'fields': 'city,country,photo_50',
              'extended': '1',
            },
          })
      // )
              .pipe(
                  catchError((error: AxiosError) => {
                    console.log(error)
                    if (
                        error.response &&
                        'data' in error.response &&
                        error.response.data != undefined
                    ) {
                      console.log(error)
                      this.logsServicePostsAdd.error(
                          `getPostsFromVK error`,
                          `ошибка получения постов в группе ${error.response} запрос и ответ`,
                      );
                    }
                    throw new Error(
                        `getPostsFromVK An error happened!`,
                    );
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

      const filteredData = { response: {} };

      return data.response

      filteredData.response = Object.fromEntries(
          Object.entries(data.response).filter(([key, value]: [string, any]) => {
            return (
                value !== false &&
                (!value.count || value.count !== 0) &&
                value.items &&
                value.items.length > 0
            );
          }),
      );

      return filteredData;
    } catch (err) {
      console.log(err)
      this.logsServicePostsAdd.error(
          `getPostsFromVK error`,
          `ошибка получения постов в группе ${err}`,
      );
    }
  }
  async getPostKeySearchNext(word, nextRate,ip) {

    const access = process.env['ACCESS_TOKEN'];
    const versionVk = process.env['VERSION_VK'];
    const currentTimeUnix = Math.floor(Date.now() / 1000); // Текущее время в Unixtime
    const startOfDayUnix = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000); // Время начала текущего дня в Unixtime
    const counter=20

    try {
      // this.httpService.get<any>(`https://api.vk.com/method/newsfeed.search?q=${word}&count=${counter}&latitude=-90&longitude=-180&start_time=${startOfDayUnix}&end_time=${currentTimeUnix}&start_from=${nextRate}&fields=city,country,photo_50&access_token=${access}&v=${versionVk}&extended=1`,

      const { data } = await firstValueFrom(
          this.httpService.get<any>(`${ip}`, { headers: {
              // 'code': `${encodeURIComponent(request)}`,
              'code': `${encodeURIComponent(word)}`,
              'version':versionVk,
              'access': `${encodeURIComponent(access)}`,
              'count': counter.toString(),
              'latitude': '-90',
              'longitude': '-180',
              'starttime': startOfDayUnix.toString(),
              'endtime': currentTimeUnix.toString(),
              'fields': 'city,country,photo_50',
              'extended': '1',
              'startfrom':`${encodeURIComponent(nextRate)}`,
            },
          })
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
                    console.log(error)
                    throw new Error(
                        `getPostsFromVK An error happened! ${data} `,
                    );
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

      const filteredData = { response: {} };

      return data.response

      filteredData.response = Object.fromEntries(
          Object.entries(data.response).filter(([key, value]: [string, any]) => {
            return (
                value !== false &&
                (!value.count || value.count !== 0) &&
                value.items &&
                value.items.length > 0
            );
          }),
      );

      return filteredData;
    } catch (err) {
      this.logsServicePostsAdd.error(
          `getPostsFromVK error`,
          `ошибка получения постов в группе ${err}`,
      );
    }
  }

  // КАТЕГОРИИ ОСТАЛЬНЫЕ
  // ЕСЛИ НЕТ ПОСТОВ В РЕПОЗИТОРИИ
  // ===================================================================================================================

  // БЛОК ФУНКЦИй ДЛЯ ДОБАВЛЕНИЯ ПОСТОВ С НОВЫХ ГРУПП
  // №1 стратовая функция
  async processGroups(indicator, start, pass, boolIndex, ip) {
    try {

      this.logsServicePostsAdd.log(`${new Date().toTimeString()} ${(indicator == 1 && !boolIndex) ? 'СОЗДАНИЕ' : indicator == 2 ? 'ОБНОВЛЕНИЕ' : 'ОБНОВЛЕНИЕ КОНКРЕТНО'}`,);
      // получаем группы с репозитория в формате масcива объектов на указанный диапазон start-pass
      let groups = await this.getGroups(start, pass);

      this.logsServicePostsAdd.log(`№1 получено ${groups.length} групп`);

      if (!groups || !groups?.length) {
        await this.logsServicePostsAdd.error('№1 ERROR', `группы с бд не получены`,);
        return;
      }

      // размер пакета групп для запроса в вк. ограничение от вк в 450
      const mainBatchSize = 450;

      // Полученный groups делим на подгруппы в кличестве указанной в mainBatchSize, стоит 450 групп
      for (let i = 0; i < groups.length; i += mainBatchSize) {
        // this.logsServicePostsAdd.log(`№1 обработка пакета группы ${i} - ${i + mainBatchSize}, всего групп ${groups.length} групп, делим по ${mainBatchSize} групп в пачке`,);
        this.processMainBatch(groups.slice(i, i + mainBatchSize), indicator, i, mainBatchSize, boolIndex, ip);
      }

    } catch (err) {
      this.logsServicePostsAdd.error(`№1 ERROR - ${err.message}`, `Ошибка на ШАГЕ №1: ${err.stack}`,);
    }
  }
  // №2 вспомогательная к стартовой функции
  async processMainBatch(groups, indicator, i, mainBatchSize, boolIndex, ip) {
    // this.logsServicePostsAdd.log(`№2 processMainBatch, запуск второй функции  для групп ${i} - ${i + mainBatchSize}, количество групп ${groups.length} ******************************************************************************************`,);

    try {
      // делим из-за ограничения по мб от вк
      let batchSize;
      if (indicator == 1) batchSize = 10; // пакеты по 10 групп в один запрос, когда постов группы нет в бд
      if (indicator == 2) batchSize = 25; // пакеты по 25 групп в один запрос, когда посты группы есть в бд

      // оставляем все id групп в строку 130459324,213267337,67332874, ... для запросов в вк
      // const groupIds = groups
      //   .map((group) => group.idVk.replace('-', ''))
      //   .join(',');
      //
      // const code = `
      //       var groupInfo = API.groups.getById({group_ids: "${groupIds}", fields: "is_closed"});
      //       return { groupInfo: groupInfo };`;
      //
      // // получаем инфу о группах в массиве и в каждом объекте есть свойство is_closed по которому определяем закрыта группа или нет
      // const groupsInfo = await limiterTwo.schedule(() => this.checkIsClosedGroup(code, ip),);
      //
      // if (!groupsInfo) {
      //   this.logsServicePostsAdd.error(`№2 для групп ${i} - ${i + mainBatchSize} - не получено инфа о закрытости для ${groupsInfo}`,`groupsInfo` );
      //   return
      // }
      //
      // // выделяем все закрытые группы, оставляем их id и помечаем их в БД
      // const closedGroupIds = groupsInfo?.response?.groupInfo?.groups
      //   .filter((group) => group.is_closed)
      //   .map((group) => `-${group.id}`);
      //
      // // помечаем в БД
      // if (closedGroupIds && closedGroupIds?.length) {
      //   this.addInfoAboutClosedGroupMain(closedGroupIds);
      // }
      // // Выделяем открытые группы для дальнейшей обработки (тут массив данных по группам из БД)
      // const openGroups = groups.filter((group) => !closedGroupIds.includes(group?.idVk),);
      // if (!openGroups || !openGroups.length) {
      //   this.logsServicePostsAdd.error(`№2 ERROR для групп ${i} - ${i + mainBatchSize}, закрытые ${closedGroupIds} из ${groups.length}`, `openGroups не получены`,);
      //   return;
      // }

      let groupsForNextFunction = [];

      // добавление новых постов с групп, постов которых нет в бд
      if (indicator == 1 && !boolIndex) {
        groupsForNextFunction = await groups?.filter((group) => (group.postsLastDate == null || !group.postsLastDate))
      } else {
        groupsForNextFunction = groups;
      }

      // создание новой категории и обновление групп
      // if (indicator == 1 && boolIndex) {
      //   groupsForNextFunction = groups;
      // }
      // // Обновление постов,
      // if (indicator == 2) {
      //   groupsForNextFunction = await Promise.all(
      //       groups?.filter((group) => group.postsLastDate !== null && group.postsLastDate !== undefined,),
      //   );
      // }

      if (!groupsForNextFunction || !groupsForNextFunction?.length) {
        this.logsServicePostsAdd.error(
          `№2 ERROR для групп ${i} - ${i + mainBatchSize} - после фильтрации в groupsForNextFunction нет групп ${groupsForNextFunction.length}, открытые ${groups.length}`,
          `groupsForNextFunction `,
        );
        return;
      }

      // this.logsServicePostsAdd.log(`К дальнейшей обработке  ${groupsForNextFunction.length} из ${groups.length}, делим ${batchSize} для групп ${i} - ${i + mainBatchSize}.`,);
      //разделяем все группы на пачки и передаем дальше под обработку
      for (let u = 0; u < groupsForNextFunction.length; u += batchSize) {
        // this.logsServicePostsAdd.log(`№2 Обработка пакета мелкого №${u / batchSize + 1} из ${Math.ceil(groupsForNextFunction.length / batchSize)} для групп ${i} - ${i + mainBatchSize}`,);
        const groupBatch = groupsForNextFunction.slice(u, u + batchSize);
        this.createAndCheckVk(indicator, groupBatch, i, u, mainBatchSize, batchSize, boolIndex, ip);
      }
    } catch (err) {
      this.logsServicePostsAdd.error(`№2 Функция processMainBatch по получению постов с вк - ошибка ШАГ №1 ERROR, для групп ${i} - ${i + mainBatchSize}`, `${err}`,);
    }
  }
  // №3 подготавливаем к запросам
  async createAndCheckVk(indicator, owner, i, u, mainBatchSize, batchSize, boolIndex, ip) {
    // owner - тут группы с бд со всей инфой что в бд

    try {
      const IfNoPostsInRepository = `80`; // если нет постов в нашем репозитории, то будем запрашивать по 100 постов
      const IfPostsAreInRepository = `10`; // если есть посты в нашем репозитории, то запрашиваем по 10
      const numberOffset = process.env['OFFSET_POST']; // начальное смещение для получения постов = 0
      let numberPost = `0`; // количество запрашиваемых постов

      if (!owner || !owner?.length) {
        await this.logsServicePostsAdd.error(`№3 ERROR для групп ${i} ${i + mainBatchSize} пачка  - ${u + batchSize} - не получены группы из второй функции`, ` с первого щага получил пустой owner`,);
        return;
      }

      // массивы для хранения данных когда нет постов групп
      const prepereRequestIfNoPostsInRepository = []; // запрос по группам для постов
      const partOfGroupsIfPostsNo = []; // массив объкетов групп которых еще нет - будем запрашивать максимум  - 100 постов
      // массивы для хранения данных когда есть посты групп - нужно только обновить
      const prepereRequestIfPostsAreInRepository = []; // запрос по группам для постов
      const partOfGroupsIfPostsAre = []; // которые есть - запрашивать будем по 10 постов

      if (indicator == 1) numberPost = IfNoPostsInRepository; // 100
      if (indicator == 2) numberPost = IfPostsAreInRepository; // 10

      if (numberPost == `0`) {await this.logsServicePostsAdd.error(`№3 ERROR третьей функции для групп ${i} ${i + mainBatchSize} пачка  - ${u + batchSize} - numberPost == 0, не поменялось значение`, `ШАГ №3 ERROR`,);
        return;
      }

      // перебираем все объекты в массиве и формируем переменную для отправки запроса на получение постов, а также разбиваем на группы
      await Promise.all(
        owner.map(async (group, index) => {
          const query = `var response${index} = API.wall.get({owner_id: ${group.idVk}, count: ${numberPost}, offset: ${numberOffset}, fields: "city,country,first_name_nom,photo_100", extended: 1});`;

          if (indicator == 1) {
            prepereRequestIfNoPostsInRepository.push(query);
            partOfGroupsIfPostsNo.push(
              owner.find((item) => item.idVk === group.idVk),
            );
          }
          if (indicator == 2) {
            prepereRequestIfPostsAreInRepository.push(query);
            partOfGroupsIfPostsAre.push(
              owner.find((item) => item.idVk === group.idVk),
            );
          }
        }),
      );

      // добавляем доп инфу к запросу и отправляем дальше
      if (indicator == 1) {
        if (!prepereRequestIfNoPostsInRepository || !prepereRequestIfNoPostsInRepository?.length) {
          await this.logsServicePostsAdd.error(
            `№3 ERROR - не сформирован prepereRequestIfNoPostsInRepository для групп ${i} ${i + mainBatchSize} пачка  - ${u + batchSize}, групп принято ${owner}`, `ШАГ №3 ERROR`,
          );
          return;
        }

        const codeIfPostsNo = prepereRequestIfNoPostsInRepository.join('\n') + '\nreturn { ' +
          prepereRequestIfNoPostsInRepository
            .map((_, index) => `group${index}: response${index}`)
            .join(', ') +
          ' };';

        if (codeIfPostsNo && codeIfPostsNo?.length)
          this.addPostsToCommonOrUpdate( codeIfPostsNo, IfNoPostsInRepository, numberOffset, partOfGroupsIfPostsNo, indicator, i, u, mainBatchSize, batchSize,boolIndex, ip);
      }

      if (indicator == 2) {
        if (!prepereRequestIfPostsAreInRepository || !prepereRequestIfPostsAreInRepository?.length) {
          await this.logsServicePostsAdd.error(
            `№3 ERROR - не сформирован prepereRequestIfPostsAreInRepository для групп ${i} ${i + mainBatchSize} пачка  - ${u + batchSize}, групп принято ${owner}`, `ШАГ №3 ERROR`,
          );
          return;
        }

        const codeIfPostsYes = prepereRequestIfPostsAreInRepository.join('\n') + '\nreturn { ' +
          prepereRequestIfPostsAreInRepository
            .map((_, index) => `group${index}: response${index}`)
            .join(', ') +
          ' };';
        if (codeIfPostsYes && codeIfPostsYes?.length)
          this.addPostsToCommonOrUpdate(codeIfPostsYes, IfPostsAreInRepository, numberOffset, partOfGroupsIfPostsAre, indicator, i, u, mainBatchSize, batchSize,boolIndex, ip);
      }
    } catch (err) {
      await this.logsServicePostsAdd.error(`№3 Функция проверки и получению постов с вк - ошибка для групп ${i} ${i + mainBatchSize} пачка  - ${u + batchSize} ***************************************************** ШАГ №2 ERROR,`, `${err}`,);
    }
  }
  // №4 тут уже цикл с передачей в функции добавления
  async addPostsToCommonOrUpdate(postsForRequst, numberPost, numberOffset, owner, indicator, i, u, mainBatchSize, batchSize,boolIndex, ip) {
    //owner - группы по 25 шт
    //postsForRequst - запрос для вк

    try {
      // this.logsServicePostsAdd.log(
      //   `№4 addPostsToCommonOrUpdate в ${new Date().toTimeString()} для групп ${i} ${i + mainBatchSize} пачка  - ${u + batchSize}, количество групп ${owner?.length} +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`,
      // );

      let startOffset = +numberOffset; // изнчально  офсет 0

      // получаем первые посты. тут будет объект в котором будет находится инфа о группе {group0: { count: 8267, items: [Array], profiles: [Array], groups: [Array] }, group1:{...}}
      const posts = await limiter.schedule(() => this.getPostsFromVK(postsForRequst, ip),);

      if (!posts || Object.keys(posts?.response)?.length == 0) {
        // this.logsServicePostsAdd.log(`№4 не получены группы или ключи для групп ${i} ${i + mainBatchSize} пачка  - ${u + batchSize} - останов`,
        // );
        return;
      }

      // массив для id групп которые не прошли по датам
      let filterGroups = await this.filterGroups(posts, indicator, i, u, mainBatchSize, batchSize,boolIndex);

      // все группы для старта, проверки и от сюда будем удалять те которые не прошли по датам
      let allGroups = owner;

      // запускаем бесконечный цикл пока allGroup не будет пустым
      for (let i = 1; i < Infinity; i++) {
        // this.logsServicePostsAdd.log(
        //   `№4 ВХОД В БЕСКОНЕЧНЫЙ ЦИКЛ -------------------------------------------------------------------- для групп ${i} ${i + mainBatchSize} пачка  - ${u + batchSize} итерация № ${i} `,
        // );
        // this.logsServicePostsAdd.log(
        //   `№4 для групп ${i} ${i + mainBatchSize} пачка  - ${u + batchSize} итерация № ${i} не прошли по датам ${filterGroups?.length} шт, а именно id: ${filterGroups}`,
        // );

        // если есть id групп которые не прошли по датам то фильтруем
        if (filterGroups && filterGroups?.length) {
          //получаем все группы с предыдущего раза
          // получаем то что остается

          const groupsForNest = allGroups.filter((groupItem) => {
            const result = !filterGroups.includes(Number(groupItem?.idVk));
            return result;
          });

          // обновили весь массив то с чем работаем
          allGroups = groupsForNest;
        }

        if (!allGroups || !allGroups?.length) {
          // this.logsServicePostsAdd.log(`№4 allGroups нет для групп ${i} ${i + mainBatchSize} пачка  - ${u + batchSize} итерация № ${i} внутри цикла allGroups = ${allGroups.length} итерация № ${i} ${new Date()}`,);
          break;
        }

        startOffset += +numberPost; // увеличиваем офсет
        // формируем запрос на сл посты в вк
        const requestPosts = [];

        for (let index = 0; index < allGroups?.length; index++) {
          const query = `var response${index} = API.wall.get({owner_id: ${allGroups[index].idVk}, count: ${numberPost}, offset: ${startOffset}, fields: "city,country,first_name_nom,photo_100", extended: 1});`;
          requestPosts.push(query);
        }
        const codeMany =
          requestPosts.join('\n') +
          '\nreturn { ' +
          requestPosts
            .map((_, index) => `group${index}: response${index}`)
            .join(', ') +
          ' };';
        const posts = await limiter.schedule(() =>
          this.getPostsFromVK(codeMany, ip),
        );

        if (!posts || Object.keys(posts.response)?.length == 0) {
          // this.logsServicePostsAdd.log(`№4 ВНУТРИ В ЦИКЛЕ ПРИ ПОВТОРНОМ ЗАПРОСЕ для групп ${i} ${i + mainBatchSize} пачка  - ${u + batchSize} - posts =  ${posts?.length}`,);
          break;
        }
        filterGroups = await this.filterGroups(posts, indicator, i, u, mainBatchSize, batchSize,boolIndex);
      }

      // this.logsServicePostsAdd.log(`№4 Завершен беспонечный цикл для групп ${i} ${i + mainBatchSize} пачка  - ${u + batchSize} - ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`,);
    } catch (err) {
      this.logsServicePostsAdd.error(`№4 error`, `ошибка где входы в цикл: для групп ${i} ${i + mainBatchSize} пачка  - ${u + batchSize} ${err} для групп`);
      this.logsServicePostsAdd.error(`№4 error`, `Stack Trace: ${err.stack}`);  // Добавить стек вызова ошибки в лог
    }
  }
  // №5 распределяем куда дальше - создаем или обновляем
  async filterGroups(posts, indicator, i, u, mainBatchSize, batchSize, boolIndex) {

    try {
      let remainingGroups = [];

      if (indicator == 1 && !boolIndex) {
        remainingGroups = await this.forFuncfilterGroupsIfCreateGroups(posts, i, u, mainBatchSize, batchSize,boolIndex);
      } else if (indicator == 2) {
        remainingGroups = await this.forFuncfilterGroupsIfUpadete(posts, i, u, mainBatchSize, batchSize,boolIndex);
      } else if (indicator == 1 && boolIndex) {
        remainingGroups = await this.forFuncfilterGroupsIfCreate(posts, i, u, mainBatchSize, batchSize,boolIndex);
      } else {
        this.logsServicePostsAdd.error(
          `№5 error для групп ${i} -${i + mainBatchSize} пачка ${u} - ${u + batchSize} `,
          `индикатор не соответсвует 1-3: его значение ${indicator}`,
        );
      }

      return remainingGroups;
    } catch (err) {
      this.logsServicePostsAdd.error(`№5 error для групп ${i} -${i + mainBatchSize} пачка ${u} - ${u + batchSize} `, `ошибка в разветвлении: ${err}`,);
    }
  }
  // №6.1 для создания
  async forFuncfilterGroupsIfCreateGroups(posts, ii, u, mainBatchSize, batchSize, boolIndex) {

    try {
      const currentMonth = new Date().getMonth(); // текущий месяц
      const currentYear = new Date().getFullYear(); // текущий год
      const searchFromCurrentMonth = currentMonth == 0 ? 0 : currentMonth - 1; // месяц до которого будем просматривать все посты с каждой группы
      const sendMessage = false;

      const remainingGroups = []; // Массив для хранения групп, циклы которых были прерваны break, не прошли по датам

      // в key мы получаем все названия групп, group0,1,2,3...
      for (const key in posts.response) {
        // проверка, есть ли у объекта posts.response собственное свойство с ключом key.
        if (Object.prototype.hasOwnProperty.call(posts.response, key)) {
          const group = posts.response[key]; // получаем инфу о конкретной группе из общего объекта
          if (!group) return;
          // this.logsServicePostsAdd.log(`'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''№6 проверяем посты группы ${group.items[0].owner_id} групп ${i} -${i + mainBatchSize} пачка ${u} - ${u + batchSize}`)

          for (let i = 0; i < group.items?.length; i++) {
            const item = group.items[i];

            // если год поста меньше года искомого и это не с закрепа то останавливаемся
            if (new Date(item.date * 1000).getFullYear() < currentYear && !item.is_pinned) {
              remainingGroups.push(item.owner_id);
              break;
            }

            if (new Date(item.date * 1000).getMonth() < searchFromCurrentMonth) {
              // если месяц меньше искомого, то проверяем не закреп ли это
              if (item.is_pinned) {
                // this.logsServicePostsAdd.log(`${group.items[0].owner_id} групп ${ii} -${ii + mainBatchSize} пачка ${u} - ${u + batchSize} дата ${new Date(item.date * 1000).getMonth()} ------------------------------------ ISPING ==== на итерации ${i}`,);
                continue;
              }
              // если не с закрепа то то кидаем в массив и прекращаем итерацию
              if (!item.is_pinned) {
                remainingGroups.push(item.owner_id);
                // this.logsServicePostsAdd.log(`${group.items[0].owner_id} групп ${ii} -${ii + mainBatchSize} пачка ${u} - ${u + batchSize}  ${new Date(item.date * 1000).getMonth()} -------------------------------- BREAK--------------  на итерации ${i}`,);
                break;
              }
            }
            // Если же дата больше искомой то добавляем в репозиторий
            if (new Date(item.date * 1000).getMonth() >= searchFromCurrentMonth && currentYear == new Date(item.date * 1000).getFullYear()) {
              const postData = {
                count: group.count,
                date: new Date(item.date * 1000),
                idVk: item.owner_id,
              };
              this.addPostCounter(postData);
              this.givePostsToAllRepositories(item, group?.groups, group?.profiles, sendMessage,boolIndex);
            }
          }
        }
      }
      return remainingGroups;
    } catch (err) {
      this.logsServicePostsAdd.error(`№6.1 error групп ${ii} -${ii + mainBatchSize} пачка ${u} - ${u + batchSize}`, `ошибка при фильтрации постов для создания: ${err}`,);
    }
  }
  // № 6.2 для обновления
  async forFuncfilterGroupsIfUpadete(posts, ii, u, mainBatchSize, batchSize, boolIndex) {

    // this.logsServicePostsAdd.log(
    //   `№6 функция обновления постов для групп ${ii} -${ii + mainBatchSize} пачка ${u} - ${u + batchSize}  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`,
    // );

    try {
      const sendMessage = true;
      const remainingGroups = []; // Массив для хранения групп, которые были прерваны, не прошли по датам

      for (const key in posts.response) {
        if (Object.prototype.hasOwnProperty.call(posts.response, key)) {
          const group = posts.response[key];
          if (!group) return;

          for (let i = 0; i < group.items?.length; i++) {
            const item = group.items[i];

            let latestPostsDates;
            const groupInfo = await this.findByIdVk(item.owner_id);

            if (groupInfo?.postsLastDate) {
              latestPostsDates = new Date(groupInfo?.postsLastDate).getTime();
            } else if (groupInfo?.postsDateWhenUpdate) {
              latestPostsDates = new Date(groupInfo?.postsDateWhenUpdate).getTime();
              groupInfo.postsLastDate = groupInfo?.postsDateWhenUpdate;
              const info = {
                id: groupInfo.id,
                group: groupInfo,
              };
              this.updateThis(info);
            } else {
              const currentDate = new Date();
              const fifteenDaysAgo = new Date(currentDate);
              fifteenDaysAgo.setDate(currentDate.getDate() - 15);
              const formattedDate = fifteenDaysAgo;
              groupInfo.postsLastDate = formattedDate;
              const info = {
                id: groupInfo.id,
                group: groupInfo,
              };
              this.updateThis(info);
            }

            if (new Date(item.date * 1000).getTime() < latestPostsDates) {
              // если это с закрпа то
              if (item.is_pinned) {
                // this.logsServicePostsAdd.log(`${group.items[0].owner_id} групп ${ii} -${ii + mainBatchSize} пачка ${u} - ${u + batchSize} дата ${new Date(item.date * 1000).getMonth()} ------------------------------------ ISPING ==== на итерации ${i}`,);
                continue;
              }
              // если не с закрепа то
              if (!item.is_pinned) {
                remainingGroups.push(item.owner_id);
                // this.logsServicePostsAdd.log(`${group.items[0].owner_id} групп ${ii} -${ii + mainBatchSize} пачка ${u} - ${u + batchSize}  ${new Date(item.date * 1000).getMonth()} -------------------------------- BREAK--------------  на итерации ${i}`,);
                this.changePostsDateToDateUpdateWhenBreak(groupInfo);
                break;
              }
            }
            if (new Date(item.date * 1000).getTime() > new Date(latestPostsDates).getTime()) {
              // this.logsServicePostsAdd.log(`${group.items[0].owner_id} групп ${ii} -${ii + mainBatchSize} пачка ${u} - ${u + batchSize} ${new Date(item.date * 1000).getMonth()} CREATE------------------------------------------  на итерации ${i}`,);
              const postData = {
                count: group.count,
                date: new Date(item.date * 1000),
                idVk: item.owner_id,
                groupInfo: groupInfo,
              };
              this.addPostDateWhenUpdate(postData);
              this.givePostsToAllRepositories(
                item,
                group?.groups,
                group?.profiles,
                sendMessage,
                boolIndex
              );
            }
            if (new Date(item.date * 1000).getTime() == latestPostsDates && !item.is_pinned) {
                remainingGroups.push(item.owner_id);
                break;
            }
          }
        }
      }

      return remainingGroups;
    } catch (err) {
      this.logsServicePostsAdd.error(
        `№6.2 error`,
        `ошибка при фильтрации постов для  update: ${err} для групп ${ii} -${ii + mainBatchSize} пачка ${u} - ${u + batchSize}`,
      );
    }
  }
  //6.3 для новой категоррии создание

  // async forFuncfilterGroupsIfCreate(posts, ii, u, mainBatchSize, batchSize, boolIndex) {
  //   // this.logsServicePostsAdd.log(
  //   //     `№6 функция получения и добавления постов для групп ${ii} -${ii + mainBatchSize} пачка ${u} - ${u + batchSize}  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`,
  //   // );
  //
  //   try {
  //     const currentMonth = new Date().getMonth(); // текущий месяц
  //     const currentYear = new Date().getFullYear(); // текущий год
  //     const searchFromCurrentMonth = currentMonth == 0 ? 0 : currentMonth - 1; // месяц до которого будем просматривать все посты с каждой группы
  //     const sendMessage = false;
  //
  //     const remainingGroups = []; // Массив для хранения групп, циклы которых были прерваны break, не прошли по датам
  //
  //     // в key мы получаем все названия групп, group0,1,2,3...
  //     for (const key in posts.response) {
  //       // проверка, есть ли у объекта posts.response собственное свойство с ключом key.
  //       if (Object.prototype.hasOwnProperty.call(posts.response, key)) {
  //         const group = posts.response[key]; // получаем инфу о конкретной группе из общего объекта
  //         if (!group) return;
  //         // this.logsServicePostsAdd.log(`'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''№6 проверяем посты группы ${group.items[0].owner_id} групп ${i} -${i + mainBatchSize} пачка ${u} - ${u + batchSize}`)
  //
  //         for (let i = 0; i < group.items?.length; i++) {
  //           const item = group.items[i];
  //           // если год поста меньше года искомого и это не с закрепа то останавливаемся
  //           if (new Date(item.date * 1000).getFullYear() < currentYear && !item.is_pinned) {
  //             remainingGroups.push(item.owner_id);
  //             break;
  //           }
  //
  //           if (new Date(item.date * 1000).getMonth() < searchFromCurrentMonth) {
  //             // если месяц меньше искомого, то проверяем не закреп ли это
  //             if (item.is_pinned) {
  //               // this.logsServicePostsAdd.log(`${group.items[0].owner_id} групп ${ii} -${ii + mainBatchSize} пачка ${u} - ${u + batchSize} дата ${new Date(item.date * 1000).getMonth()} ------------------------------------ ISPING ==== на итерации ${i}`,);
  //               continue;
  //             }
  //             // если не с закрепа то то кидаем в массив и прекращаем итерацию
  //             if (!item.is_pinned) {
  //               remainingGroups.push(item.owner_id);
  //               // this.logsServicePostsAdd.log(`${group.items[0].owner_id} групп ${ii} -${ii + mainBatchSize} пачка ${u} - ${u + batchSize}  ${new Date(item.date * 1000).getMonth()} -------------------------------- BREAK--------------  на итерации ${i}`,);
  //               break;
  //             }
  //           }
  //           // Если же дата больше искомой то добавляем в репозиторий
  //           if (new Date(item.date * 1000).getMonth() >= searchFromCurrentMonth && currentYear == new Date(item.date * 1000).getFullYear()) {
  //             // await this.create(item, group.groups, group.profiles, 'vk'); // ТУТ УБРАТЬ AWAIT ДЛЯ ИСКЛЮЧЕНИЯ ЗЕДЕРЖЕК
  //             const postData = {
  //               count: group.count,
  //               date: new Date(item.date * 1000),
  //               idVk: item.owner_id,
  //             };
  //             this.givePostsToAllRepositories(item, group?.groups, group?.profiles, sendMessage,boolIndex);
  //           }
  //         }
  //       }
  //     }
  //     return remainingGroups;
  //   } catch (err) {
  //     this.logsServicePostsAdd.error(
  //         `№6.1 error групп ${ii} -${ii + mainBatchSize} пачка ${u} - ${u + batchSize}`,
  //         `ошибка при фильтрации постов для создания 22 : ${err}!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`,
  //     );
  //   }
  // }

  //6.3 это чтобы пробежать текущий день, если есть подозрение что что-то не то и посты не все добавлены
  async forFuncfilterGroupsIfCreate(posts, ii, u, mainBatchSize, batchSize, boolIndex) {

    try {
      const currentDay = new Date().getDate() // текущий день
      const currentYear = new Date().getFullYear(); // текущий год
      // const searchFromCurrentMonth = currentMonth == 0 ? 0 : currentMonth - 1; // месяц до которого будем просматривать все посты с каждой группы
      const sendMessage = false;

      const remainingGroups = []; // Массив для хранения групп, циклы которых были прерваны break, не прошли по датам

      // в key мы получаем все названия групп, group0,1,2,3...
      for (const key in posts.response) {
        // проверка, есть ли у объекта posts.response собственное свойство с ключом key.
        if (Object.prototype.hasOwnProperty.call(posts.response, key)) {
          const group = posts.response[key]; // получаем инфу о конкретной группе из общего объекта
          if (!group) return;
          // this.logsServicePostsAdd.log(`'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''№6 проверяем посты группы ${group.items[0].owner_id} групп ${i} -${i + mainBatchSize} пачка ${u} - ${u + batchSize}`)

          for (let i = 0; i < group.items?.length; i++) {
            const item = group.items[i];
            // если год поста меньше года искомого и это не с закрепа то останавливаемся
            if (new Date(item.date * 1000).getFullYear() < currentYear && !item.is_pinned) {
              remainingGroups.push(item.owner_id);
              break;
            }

            if (new Date(item.date * 1000).getDate() < currentDay) {
              // если месяц меньше искомого, то проверяем не закреп ли это
              if (item.is_pinned) {
                // this.logsServicePostsAdd.log(`${group.items[0].owner_id} групп ${ii} -${ii + mainBatchSize} пачка ${u} - ${u + batchSize} дата ${new Date(item.date * 1000).getMonth()} ------------------------------------ ISPING ==== на итерации ${i}`,);
                continue;
              }
              // если не с закрепа то то кидаем в массив и прекращаем итерацию
              if (!item.is_pinned) {
                remainingGroups.push(item.owner_id);
                // this.logsServicePostsAdd.log(`${group.items[0].owner_id} групп ${ii} -${ii + mainBatchSize} пачка ${u} - ${u + batchSize}  ${new Date(item.date * 1000).getMonth()} -------------------------------- BREAK--------------  на итерации ${i}`,);
                break;
              }
            }
            // Если же дата больше искомой то добавляем в репозиторий
            if (new Date(item.date * 1000).getDate() >= currentDay && currentYear == new Date(item.date * 1000).getFullYear()) {
              this.givePostsToAllRepositories(item, group?.groups, group?.profiles, sendMessage,boolIndex);
            }
          }
        }
      }
      return remainingGroups;
    } catch (err) {
      this.logsServicePostsAdd.error(
          `№6.1 error групп ${ii} -${ii + mainBatchSize} пачка ${u} - ${u + batchSize}`,
          `ошибка при фильтрации постов для создания 22 : ${err}!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`,
      );
    }
  }
  // =================================================================================
  // Redis
  async getKeysRedis() {
    const keys = await this.redisService.getAllKeys('id:8-*');
    await this.redisService.deleteKeysByPattern("id:8-*");
    return keys;
  }
  async getRedisPosts() {

    const groups = 50;
    const text = `post_date_publish`
    const year = new Date().getFullYear() - 1;

    try {

      for (let i = 1; i <= groups; i++) {
        const pattern = await this.redisService.getAllKeys(`id:${i}-*`);

        pattern.forEach(async (item) => {
          const posts = await this.redisService.get(`${item}`)
          const date = posts[0][text]

          if (new Date(date *1000).getFullYear() < year) {
            await this.redisService.del(item);
          }

        })
      }

    } catch (err) {
      if (err.response === 'Пользователь не найден') {
        throw err
      }
    }
  }


  // ТУТ ДАЛЬШЕ НА ПЕРИОД УКОМПЛЕКТОВАНИЯ ГРУПП
  /*
  async addGroupFromVk(owner, ip) {
    // owner - тут группы с бд со всей инфой что в бд

    try {
      const IfNoPostsInRepository = `100`; // если нет постов в нашем репозитории, то будем запрашивать по 100 постов
      const numberOffset = process.env['OFFSET_POST']; // начальное смещение для получения постов = 0
      let numberPost = `0`; // количество запрашиваемых постов

      // массивы для хранения данных когда нет постов групп
      const prepereRequestIfNoPostsInRepository = []; // запрос по группам для постов
      // const partOfGroupsIfPostsNo = owner; // массив объкетов групп которых еще нет - будем запрашивать максимум  - 100 постов

      // перебираем все объекты в массиве и формируем переменную для отправки запроса на получение постов, а также разбиваем на группы
      await Promise.all(
          owner.map(async (group, index) => {
            const obj = `-${group}`
            const query = `var response${index} = API.wall.get({owner_id: ${obj}, count: ${numberPost}, offset: ${numberOffset}});`;

              prepereRequestIfNoPostsInRepository.push(query);
              // partOfGroupsIfPostsNo.push(
              //     owner.find((item) => item === group),
              // );
          }),
      );

        const codeIfPostsNo = prepereRequestIfNoPostsInRepository.join('\n') + '\nreturn { ' +
            prepereRequestIfNoPostsInRepository
                .map((_, index) => `group${index}: response${index}`)
                .join(', ') +
            ' };';

        if (codeIfPostsNo && codeIfPostsNo?.length)
          this.addPostsTo( codeIfPostsNo, IfNoPostsInRepository, numberOffset, owner, ip);


    } catch (err) {
      await this.logsServicePostsAdd.error(`№3 Функция проверки и получению постов с вк - ошибка для групп ***************************************************** ШАГ №2 ERROR,`, `${err}`,);
    }
  }
  async addPostsTo(postsForRequst, numberPost, numberOffset, owner, ip) {
    //owner - группы по 25 шт
    //postsForRequst - запрос для вк

    try {

      let startOffset = +numberOffset; // изнчально  офсет 0

      // получаем первые посты. тут будет объект в котором будет находится инфа о группе {group0: { count: 8267, items: [Array], profiles: [Array], groups: [Array] }, group1:{...}}
      const posts = await limiter.schedule(() => this.getPostsFromVK(postsForRequst, ip),);

      if (!posts || Object.keys(posts?.response)?.length == 0) {
        // this.logsServicePostsAdd.log(`№4 не получены группы или ключи для групп ${i} ${i + mainBatchSize} пачка  - ${u + batchSize} - останов`,
        // );
        return;
      }

      // массив для id групп которые не прошли по датам
      let filterGroups = await this.filterGroupsPosts(posts);

      // все группы для старта, проверки и от сюда будем удалять те которые не прошли по датам
      let allGroups = owner;

      // запускаем бесконечный цикл пока allGroup не будет пустым
      for (let i = 1; i < Infinity; i++) {

        // если есть id групп которые не прошли по датам то фильтруем
        if (filterGroups && filterGroups?.length) {
          //получаем все группы с предыдущего раза
          // получаем то что остается

          const groupsForNest = allGroups.filter((groupItem) => {
            const result = !filterGroups.includes(Number(groupItem?.idVk));
            return result;
          });

          // обновили весь массив то с чем работаем
          allGroups = groupsForNest;
        }

        if (!allGroups || !allGroups?.length) {
          // this.logsServicePostsAdd.log(`№4 allGroups нет для групп ${i} ${i + mainBatchSize} пачка  - ${u + batchSize} итерация № ${i} внутри цикла allGroups = ${allGroups.length} итерация № ${i} ${new Date()}`,);
          break;
        }

        startOffset += +numberPost; // увеличиваем офсет
        // формируем запрос на сл посты в вк
        const requestPosts = [];

        for (let index = 0; index < allGroups?.length; index++) {
          const query = `var response${index} = API.wall.get({owner_id: ${allGroups[index].idVk}, count: ${numberPost}, offset: ${startOffset}, fields: "city,country,first_name_nom,photo_100", extended: 1});`;
          requestPosts.push(query);
        }
        const codeMany =
            requestPosts.join('\n') +
            '\nreturn { ' +
            requestPosts
                .map((_, index) => `group${index}: response${index}`)
                .join(', ') +
            ' };';
        const posts = await limiter.schedule(() =>
            this.getPostsFromVK(codeMany, ip),
        );

        if (!posts || Object.keys(posts.response)?.length == 0) {
          // this.logsServicePostsAdd.log(`№4 ВНУТРИ В ЦИКЛЕ ПРИ ПОВТОРНОМ ЗАПРОСЕ для групп ${i} ${i + mainBatchSize} пачка  - ${u + batchSize} - posts =  ${posts?.length}`,);
          break;
        }
        filterGroups = await this.filter(posts, indicator, i, u, mainBatchSize, batchSize,boolIndex);
      }

      // this.logsServicePostsAdd.log(`№4 Завершен беспонечный цикл для групп ${i} ${i + mainBatchSize} пачка  - ${u + batchSize} - ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`,);
    } catch (err) {
      this.logsServicePostsAdd.error(`№4 error`, `ошибка где входы в цикл: для групп ${i} ${i + mainBatchSize} пачка  - ${u + batchSize} ${err} для групп`);
      this.logsServicePostsAdd.error(`№4 error`, `Stack Trace: ${err.stack}`);  // Добавить стек вызова ошибки в лог
    }
  }
  async filterGroupsPosts(posts) {
    // this.logsServicePostsAdd.log(
    //     `№6 функция получения и добавления постов для групп ${ii} -${ii + mainBatchSize} пачка ${u} - ${u + batchSize}  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`,
    // );

    try {
      const currentMonth = new Date().getMonth(); // текущий месяц
      const currentYear = new Date().getFullYear(); // текущий год
      const searchFromCurrentMonth = currentMonth == 0 ? 0 : currentMonth - 1; // месяц до которого будем просматривать все посты с каждой группы
      const sendMessage = false;

      const remainingGroups = []; // Массив для хранения групп, циклы которых были прерваны break, не прошли по датам

      // в key мы получаем все названия групп, group0,1,2,3...
      for (const key in posts.response) {
        // проверка, есть ли у объекта posts.response собственное свойство с ключом key.
        if (Object.prototype.hasOwnProperty.call(posts.response, key)) {
          const group = posts.response[key]; // получаем инфу о конкретной группе из общего объекта
          if (!group) return;
          // this.logsServicePostsAdd.log(`'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''№6 проверяем посты группы ${group.items[0].owner_id} групп ${i} -${i + mainBatchSize} пачка ${u} - ${u + batchSize}`)

          for (let i = 0; i < group.items?.length; i++) {
            const item = group.items[i];
            // если год поста меньше года искомого и это не с закрепа то останавливаемся
            if (new Date(item.date * 1000).getFullYear() < currentYear && !item.is_pinned) {
              remainingGroups.push(item.owner_id);
              break;
            }

            if (new Date(item.date * 1000).getMonth() < searchFromCurrentMonth) {
              // если месяц меньше искомого, то проверяем не закреп ли это
              if (item.is_pinned) {
                // this.logsServicePostsAdd.log(`${group.items[0].owner_id} групп ${ii} -${ii + mainBatchSize} пачка ${u} - ${u + batchSize} дата ${new Date(item.date * 1000).getMonth()} ------------------------------------ ISPING ==== на итерации ${i}`,);
                continue;
              }
              // если не с закрепа то то кидаем в массив и прекращаем итерацию
              if (!item.is_pinned) {
                remainingGroups.push(item.owner_id);
                // this.logsServicePostsAdd.log(`${group.items[0].owner_id} групп ${ii} -${ii + mainBatchSize} пачка ${u} - ${u + batchSize}  ${new Date(item.date * 1000).getMonth()} -------------------------------- BREAK--------------  на итерации ${i}`,);
                break;
              }
            }
            // Если же дата больше искомой то добавляем в репозиторий
            if (new Date(item.date * 1000).getMonth() >= searchFromCurrentMonth && currentYear == new Date(item.date * 1000).getFullYear()) {
              // await this.create(item, group.groups, group.profiles, 'vk'); // ТУТ УБРАТЬ AWAIT ДЛЯ ИСКЛЮЧЕНИЯ ЗЕДЕРЖЕК
              if (item.text.includes(
                  'ищу' ||
                  'подскажите' ||
                  'посоветуйте' ||
                  'необходимо' ||
                  'требуется' ||
                  'продаю' ||
                  'продам' ||
                  'куплю' ||
                  'купим' ||
                  'покупаю' ||
                  'репетит' ||
                  'ищу' ||
                  'без посредников' ||
                  'аренд' ||
                  'работа' ||
                  'продай' ||
                  'спроси' ||
                  'совет' ||
                  'ЕГЭ' ||
                  'ОГЭ' ||
                  'вакансии' ||
                  'посуточн' ||
                  "аренд"
              )) {
                const sameGroup = await this.findByIdVkGroup(`-${item.id}`)
                if (!sameGroup) {
                  await this.repository.save({
                    idVk: `-${item.id}`,
                  })
                  const sameGroup = await this.findByIdVk(`-${item.id}`)
                  sameGroup.name = item.name
                  await this.repository.update(sameGroup.id, sameGroup)
                }
              }
            }
          }
        }
      }
      return remainingGroups;
    } catch (err) {
      this.logsServicePostsAdd.error(
          `№6.1 error групп ${ii} -${ii + mainBatchSize} пачка ${u} - ${u + batchSize}`,
          `ошибка при фильтрации постов для создания 22 : ${err}!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`,
      );
    }
  }
  async findByIdVkGroup(id) {
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
*/


  // НОВЫЙ ГЛОБАЛЬНАЙ СЕРЧ
  async processGroup(category, ip, ipTwo) {
    //category - одна категория

    try {

      if(!category?.id || category?.extraWords?.length < 1) return
      const words = category?.extraWords; // массив объектов с ключевыми словами по которым искать по одной категории

      let nextRate; // для перебора следующей страницы во время поиска
      let counter = 50; // стартовое значение для цикла, ограничение на 1000 постов

      // for (const word of words) {
        words.forEach(async (word) => {
        // console.log(word)
        // один объект формата {"id": 1, "word": "репетитор", "dateLast": null, "dateUpdate": null}
        const thisExtraWordObject = word;
        // дата последнего поста с БД перед началом цикла по конкретному слову с объекта {"id": 1, "word": "репетитор", "dateLast": null, "dateUpdate": null}
        let dateLst = thisExtraWordObject?.dateLast;
        // тут сохраняем дату на период перебора чтобы потом обновить дату в базе данных
        let saveDateLastPostWhenSearching;

        if(!dateLst) {
          const currentDate = new Date();
          currentDate.setHours(0, 1, 0, 0);
          const unixTime = Math.floor(currentDate.getTime() / 1000); // Преобразование текущей даты и времени в Unixtime (в секундах)
          dateLst = unixTime;
        }

         for (let i = 0; i <= counter; i++) {
          // console.log(i)

           let result;

           if(i >= 1) {
             result = await limiter.schedule(() => this.getPostKeySearchNext(word.word, nextRate,ipTwo),);
             nextRate = result?.next_from
           }

           if(i == 0) {
             result = await limiter.schedule(() => this.getPostKeySearch(word.word, ip),);
             nextRate = result?.next_from
           }

           if (!result?.items || result?.items?.length < 1) break

           // counter = Math.ceil(result?.total_count / 20)

             for(let o = 0; o <= result?.items?.length; o++){

             const item = result?.items?.[o]
              // console.log(result)
              // если есть дата последнего поста в бд то проверяем пост проходит или нет
             if(dateLst) {
               if(new Date(item?.date*1000).getTime() >= new Date(dateLst).getTime()) {
                 // console.log(`${new Date(item.date*1000).toLocaleDateString()}${new Date(item.date*1000).toLocaleTimeString()}`)
                 // console.log(new Date(item?.date*1000))
                 // console.log(new Date(dateLst))
                 // console.log('=======================================')
                 this.addNewPostToOtherRepositories(item, result.groups, result.profiles, true, category, telegramLimiter,);
                 if (!saveDateLastPostWhenSearching) saveDateLastPostWhenSearching = item?.date;

                 if(i == counter) {
                   // console.log('max')
                   if(saveDateLastPostWhenSearching) {
                     if (thisExtraWordObject) {
                       thisExtraWordObject.dateLast = saveDateLastPostWhenSearching;
                       thisExtraWordObject.dateUpdate = saveDateLastPostWhenSearching;
                     }
                     const newExtra = category?.extraWords?.filter((thisWord) => thisWord.id != thisExtraWordObject.id)
                     category.extraWords = [...newExtra, thisExtraWordObject]
                     this.updateTCategory(category)
                     break
                   }
                 }
               }

               if(new Date(item?.date*1000).getTime() < new Date(dateLst).getTime()) {
                 // console.log('loose')
                 if(saveDateLastPostWhenSearching) {
                   if (thisExtraWordObject) {
                     thisExtraWordObject.dateLast = saveDateLastPostWhenSearching;
                     thisExtraWordObject.dateUpdate = saveDateLastPostWhenSearching;
                   }
                   const newExtra = category?.extraWords?.filter((thisWord) => thisWord.id != thisExtraWordObject.id)
                   category.extraWords = [...newExtra, thisExtraWordObject]
                   this.updateTCategory(category)
                   break
                 }
               }

               if(i == counter) {
                 // console.log('chooose')
                 if(saveDateLastPostWhenSearching) {
                   if (thisExtraWordObject) {
                     thisExtraWordObject.dateLast = saveDateLastPostWhenSearching;
                     thisExtraWordObject.dateUpdate = saveDateLastPostWhenSearching;
                   }
                   const newExtra = category?.extraWords?.filter((thisWord) => thisWord.id != thisExtraWordObject.id)
                   category.extraWords = [...newExtra, thisExtraWordObject]
                   // this.updateTCategory(category)
                   break
                 }
               }
             }
           }
         }
        })

    } catch (err) {
      this.logsServicePostsAdd.error(`№1 ERROR - ${err.message}`, `Ошибка на ШАГЕ №1: ${err.stack}`,);
    }
  }


  //код для запроса




}
