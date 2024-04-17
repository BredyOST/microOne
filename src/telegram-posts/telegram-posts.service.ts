import { Injectable } from '@nestjs/common';
import {LogsService} from "../otherServices/logger.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {HttpService} from "@nestjs/axios";
import {RedisService} from "../redis/redis.service";
import {TutorsService} from "../AllCategoriesForSearch/tutors/tutors.service";
import {NanniesService} from "../AllCategoriesForSearch/nannies/nannies.service";
import {HandymanAndBuilderService} from "../AllCategoriesForSearch/handyman-and-builder/handyman-and-builder.service";
import {PurchaseSaleApartService} from "../AllCategoriesForSearch/purchase-sale-apart/purchase-sale-apart.service";
import {RentRentalApartService} from "../AllCategoriesForSearch/rent-rental-apart/rent-rental-apart.service";
import {
  EquipRepairMaintenanceService
} from "../AllCategoriesForSearch/equip-repair-maintenance/equip-repair-maintenance.service";
import {LawyerService} from "../AllCategoriesForSearch/lawyer/lawyer.service";
import {ItWebService} from "../AllCategoriesForSearch/it-web/it-web.service";
import {TelegramPostEntity} from "./entities/telegram-post.entity";
import {StringSession} from "telegram/sessions";
import * as process from 'process';
import * as input from 'input';
import {Api, TelegramClient} from "telegram";
import GetHistory = Api.messages.GetHistory;
import Bottleneck from "bottleneck";

const telegramLimiter = new Bottleneck({
  maxConcurrent: 1, // Максимальное количество одновременных запросов
  minTime: 500, // Минимальное время между запросами (в миллисекундах)
});

@Injectable()
export class TelegramPostsService {
  private client: TelegramClient; // Объявляем свойство client
  constructor(
      private logsServicePostsAdd: LogsService,
      @InjectRepository(TelegramPostEntity)
      private repository: Repository<TelegramPostEntity>,
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
  ) {
  }


  // запрос на другой сервер (основной)
  async getChats(start, pass) {

    try {
      const link = process.env['API_URL'];
      const response = await fetch(`${link}/chats-from-telegram/getPartOfGroup?size=${start}&offset=${pass}`, {
        method: 'GET',
      });

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
  async getLogIn() {
    const apiId = +process.env['API_ID']; // Ваш API ID
    const apiHash = process.env['API_HASH'];
    const phone = process.env['TG_NUMBER'];
    const stringSession = new StringSession(process.env["TELEGRAM_SESSION_STRING"]); // Значение из сессии, чтобы избежать повторной аутентификации

    this.client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    const start = async () => {
      console.log("Loading interactive example...");
      await this.client.start({
        phoneNumber: async () => await input.text(`${phone}`),
        password: async () => await input.text('password'),
        phoneCode: async () => await input.text('Code'),
        onError: (err) => {
          console.log(err)
        },
      });
      console.log("You should now be connected.");
      console.log(this.client.session.save());
    }

    await start()
  }
  async addPostCounter(info) {
    try {
      const link = process.env['API_URL'];

      const response = await fetch(`${link}/chats-from-telegram/addPostCounter`, {
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
  async findByNameChat(chatName) {
    try {
      const link = process.env['API_URL'];

      const response = await fetch(`${link}/chats-from-telegram/findByNameChat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatName }),
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

      const response = await fetch(`${link}/chats-from-telegram/updateThis`, {
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
  async changePostsDateToDateUpdateWhenBreak(info) {
    try {
      const link = process.env['API_URL'];

      const response = await fetch(
          `${link}/chats-from-telegram/changePostsDateToDateUpdateWhenBreak`,
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
          `${link}/chats-from-telegram/addPostDateWhenUpdate`,
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

  // ----------------------------------------------------------
// № 1разводящая функция когда появляется новый пост, направляет в другие репозитории
  async givePostsToAllRepositories(item, chats, users, sendMessage, boolIndex) {

    const profile = users.find((elem) => elem?.id?.value?.toString() == item?.fromId?.userId?.value?.toString())
    const group = chats.find((elem) => elem?.id?.value?.toString() == item?.peerId?.channelId?.value?.toString())

    try {

      const allCategories = await this.getCategories();
      if (!allCategories || !allCategories?.length) {
        return
      }

      if (!boolIndex) {
        await Promise.all(
            allCategories.map(async (category) => {
              if (!category?.disabled) {
                this.addNewPostToOtherRepositories(item, group, profile, sendMessage, category, telegramLimiter,);
              }
            }),
        );
      }
      if (boolIndex) {

        await Promise.all(
            allCategories.map(async (category) => {
              if (category?.create) {
                this.addNewPostToOtherRepositories(item, chats, users, sendMessage, category, telegramLimiter,);
              }
            }),
        );
      }

    } catch (err) {
      await this.logsServicePostsAdd.error(
          `givePostsToAllRepositories ERROR - ${err.message}`,
          `Ошибка в разводящей функции ${err.stack}`,
      );
    }
  }
//   // №2 проверяем
  async addNewPostToOtherRepositories(item, chats, users,  sendMessage, category, telegramLimiter,) {

    try {
      // токен бота
      const tokenBot = process.env['TOKEN_BOT'];

      const categories = [
        { id: 1, name: 'Для репетиторов', service: this.tutorService },
        // { id: 2, name: 'Поиск домашнего персонала', service: this.nanniesService,},
        // { id: 3, name: 'Ремонт и обслуживание техники', service: this.equipRepairMaintenanceService,},
        // { id: 4, name: 'Ремонт и строительство', service: this.handymanAndBuilderService,},
        // { id: 5, name: 'Аренда, сдача недвижимости', service: this.rentRentalApartService,},
        // { id: 6, name: 'Покупка, продажа недвижимости', service: this.purchaseSaleApartService,},
        // { id: 7, name: 'Для юристов', service: this.lawyerService },
        // { id: 8, name: 'IT/Web', service: this.itWebService },
      ];

      const categoryInfo = categories.find((cat) => cat.id === category.id);

      if (!categoryInfo) return

      if (categoryInfo) {
        if (categoryInfo.service) {
          const isSamePost = await categoryInfo.service.getPostById(item.id);
          if (isSamePost) return;
        }

        const positiveWords = await category?.positiveWords;
        const negativeWords = await category?.negativeWords;

        const filter = await this.filterOnePostForOthersRepositories(item, positiveWords, negativeWords, 1,);

        if (filter) {
          await categoryInfo.service?.createTg(
              item,
              chats,
              users,
              'tg',
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
//   //№3 фильтруем пост по ключевым словам
  async filterOnePostForOthersRepositories(post, positiveKeywords, negativeKeywords, indicator,) {
    try {
      let postText;

      if (indicator == 1) postText = post.message.toLowerCase();
      if (indicator == 2) postText = post.post_text.toLowerCase();

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



  //--------------------------------------------------
  // async processGroups(indicator, start, pass, boolIndex, ip) {
  //
  //   // получаем чаты с репозитория в формате масcива объектов на указанный диапазон start-pass
  //   // let groups = await this.getChats(start, pass);
  //
  //   // const groupsNames = groups.map((item) => item.chatName)
  //
  //   const apiId = +process.env['API_ID']; // Ваш API ID
  //   const apiHash = process.env['API_HASH'];
  //   // let end;
  //   // if(indicator == 1) end = 2
  //   // if(indicator == 2) end = 1
  //
  //   const stringSession = new StringSession(process.env['TELEGRAM_SESSION_STRING']); // Значение из сессии, чтобы избежать повторной аутентификации
  //   const client = new TelegramClient(stringSession, apiId, apiHash, {});
  //
  //   const run = async () => {
  //     await client.connect(); // Подключение к Telegram
  //
  //
  //     let offsetRate = 0
  //     let offsetId = 0
  //
  //       for (let i = 0; i < 50; i++) {
  //         console.log(`--------------------------------${i}`)
  //         if(i > 30) break
  //         const result = await client.invoke(
  //             new SearchGlobal({
  //               q: "дом", // Слово для поиска
  //               filter: new Api.InputMessagesFilterEmpty(),
  //               minDate: Math.floor(Date.now() / 1000) - (24 * 60 * 60),
  //               maxDate: Math.floor(Date.now() / 1000),
  //               offsetRate: +offsetRate, // Начальное значение для пагинации = 0
  //               offsetPeer: new Api.InputPeerEmpty(), // Смещение для пагинации (указан username)
  //               offsetId: +offsetId, // Начальное значение идентификатора для пагинации = 0
  //               limit: 5
  //             })
  //         );
  //         let messages;
  //         let users;
  //         let chats;
  //         if ('messages' in result) {
  //           messages = result?.messages; // Получаем массив сообщений из ответа
  //         }
  //         if ('users' in result) {
  //           users = result?.users; // Получаем массив сообщений из ответа
  //         }
  //         if ('chats' in result) {
  //           chats = result?.chats; // Получаем массив сообщений из ответа
  //         }
  //         // console.log(result)
  //
  //         if('nextRate' in result) {
  //           console.log(result.nextRate)
  //           console.log(messages.at(-1).id)
  //           offsetRate = result.nextRate + 1
  //           offsetId = Math.max(...messages.map(item => item.id));
  //           // offsetId = messages?.at(-1)?.id
  //         }
  //
  //         messages.forEach((item) => {
  //           // console.log(new Date(item.date * 1000))
  //           // console.log(`+++`)
  //           console.log(item.id)
  //         })
  //
  //         if (indicator == 1 && !boolIndex) {
  //           // await this.forFuncfilterGroupsIfCreateGroups(messages, users,chats, i, boolIndex,item);
  //         } else if (indicator == 2) {
  //           // this.forFuncfilterGroupsIfUpadete(messages, users,chats, i, boolIndex,item);
  //         } else if (indicator == 1 && boolIndex) {
  //           // this.forFuncfilterGroupsIfCreate(messages, users,chats, i, boolIndex,item);
  //         }
  //       }
  //
  //
  //     await client.disconnect(); // Отключение от Telegram
  //   };
  //
  //   await run(); // Вызываем функцию run
  // }




  async processGroups(indicator, start, pass, boolIndex, ip) {

    // получаем чаты с репозитория в формате масcива объектов на указанный диапазон start-pass
    let groups = await this.getChats(start, pass);

    const groupsNames = groups.map((item) => item.chatName)

    const apiId = +process.env['API_ID']; // Ваш API ID
    const apiHash = process.env['API_HASH'];
    let end;
    if(indicator == 1) end = 15
    if(indicator == 2) end = 1

    const stringSession = new StringSession(process.env['TELEGRAM_SESSION_STRING']); // Значение из сессии, чтобы избежать повторной аутентификации
    const client = new TelegramClient(stringSession, apiId, apiHash, {});

    const run = async () => {
      await client.connect(); // Подключение к Telegram

      for (let item of groupsNames) {

        let start = 0

        for (let i = 0; i < end; i++) {
          await telegramLimiter.schedule(async () => {
          const result = await client.invoke(
              new GetHistory({
                peer:`${item}`, // Имя пользователя или ID чата
                limit: 10, // Количество сообщений для получения
                addOffset: start,
              })
          );
          console.log(result)

          let messages;
          let users;
          let chats;
          if ('messages' in result) {
            messages = result?.messages; // Получаем массив сообщений из ответа
          }
          if ('users' in result) {
            users = result?.users; // Получаем массив сообщений из ответа
          }
          if ('chats' in result) {
            chats = result?.chats; // Получаем массив сообщений из ответа
          }

          if (indicator == 1 && !boolIndex) {
            await this.forFuncfilterGroupsIfCreateGroups(messages, users,chats, i, boolIndex,item);
          } else if (indicator == 2) {
            // this.forFuncfilterGroupsIfUpadete(messages, users,chats, i, boolIndex,item);
          } else if (indicator == 1 && boolIndex) {
            // this.forFuncfilterGroupsIfCreate(messages, users,chats, i, boolIndex,item);
          }
        });
        }
      }
      await client.disconnect(); // Отключение от Telegram
    };

    await run(); // Вызываем функцию run
  }
  async forFuncfilterGroupsIfCreateGroups(messages, users, chats, i, boolIndex, chatName) {


    try {
      const currentMonth = new Date().getMonth(); // текущий месяц
      const currentYear = new Date().getFullYear(); // текущий год
      const searchFromCurrentMonth = currentMonth == 0 ? 0 : currentMonth - 1; // месяц до которого будем просматривать все посты с каждой группы
      const sendMessage = false;


      for (let i = 0; i < messages.length; i++) {

        const item = messages[i];

        if(item.className == 'Message') {
          console.log(item.id)
          // если год поста меньше года искомого и это не с закрепа то останавливаемся
          if (new Date(item.date * 1000).getFullYear() < currentYear) {
            break;
          }

          if (new Date(item.date * 1000).getMonth() < searchFromCurrentMonth) {
              break;
          }

          // Если же дата больше искомой то добавляем в репозиторий
          if (new Date(item.date * 1000).getMonth() >= searchFromCurrentMonth && currentYear == new Date(item.date * 1000).getFullYear()) {
            const postData = {
              date: new Date(item.date * 1000),
              chatName: chatName,
            };
            this.addPostCounter(postData);
            this.givePostsToAllRepositories(item, chats, users, sendMessage,boolIndex);
          }
        }
      }
    }catch (err) {
      // this.logsServicePostsAdd.error(`№6.1 error групп ${ii} -${ii + mainBatchSize} пачка ${u} - ${u + batchSize}`, `ошибка при фильтрации постов для создания: ${err}`,);
    }
  }

  async forFuncfilterGroupsIfUpadete(messages, users, chats, i, boolIndex, chatName) {

    try {

      const sendMessage = true;

      let latestPostsDates;
      const groupInfo = await this.findByNameChat(chatName);

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

      for (let i = 0; i < messages.length; i++) {

        const item = messages[i];

        if(item.className == 'Message') {

          if (new Date(item.date * 1000).getTime() < latestPostsDates) {
              this.changePostsDateToDateUpdateWhenBreak(groupInfo);
              break;
          }
          if (new Date(item.date * 1000).getTime() > new Date(latestPostsDates).getTime()) {
            const postData = {
              date: new Date(item.date * 1000),
              idVk: item.owner_id,
              groupInfo: groupInfo,
            };
            this.addPostDateWhenUpdate(postData);
            this.givePostsToAllRepositories(
                item,
                users,
                chats,
                sendMessage,
                boolIndex
            );
          }
        }
      }
    }catch (err) {
      // this.logsServicePostsAdd.error(`№6.1 error групп ${ii} -${ii + mainBatchSize} пачка ${u} - ${u + batchSize}`, `ошибка при фильтрации постов для создания: ${err}`,);
    }
  }

}


