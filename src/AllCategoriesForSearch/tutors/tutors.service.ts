import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { TutorEntity } from './entities/tutor.entity';
import { AppService } from '../../app.service';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios/index';
import { RedisService } from '../../redis/redis.service';
import { LogsService } from '../../otherServices/logger.service';
import * as process from 'process';
import { CitiesService } from '../../cities/cities.service';

@Injectable()
export class TutorsService {
  private readonly logger = new Logger(AppService.name);
  private id: string | number;
  constructor(
    @InjectRepository(TutorEntity)
    private repository: Repository<TutorEntity>,
    private readonly httpService: HttpService,
    private logsService: LogsService,
    private redisService: RedisService,
    private citiesService: CitiesService,
  ) {
    this.id = process.env['ID_CHAT_TUTORS']; // 1й
  }

  // найти конкретный пост
  async getPostById(post_id) {
    return await this.repository.findOne({
      where: {
        post_id,
      },
    });
  }
  // найти посты для одной группы
  async getAllPostsByIdForOneGroup(post_owner_id: string) {
    return await this.repository.find({
      where: {
        post_owner_id,
      },
      order: {
        post_date_publish: 'DESC', // Сортировка по дате в убывающем порядке (самые свежие в начале)
      },
    });
  }
  // получить весь репозиторий c Redis
  async getAll() {
    const posts = await this.redisService.get(
      '1dd67c02cf41f00cde6819e97c3752d91b742a1b99c8bc209252ad028c35bbba',
    );
    if (posts && posts !== null) {
      return JSON.parse(posts).sort(
        (a, b) => b.post_date_publish - a.post_date_publish,
      );
    }
  }
  async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  // сохраняем по ключам все в Redis
  async savePostsToRedis() {
    try {
      const postCountInKey = 300;
      const queryBuilder = this.repository.createQueryBuilder('posts');
      const sortedPosts = await queryBuilder
          .orderBy('posts.post_date_publish', 'DESC')
          .getMany();

      const pattern = await this.redisService.getAllKeys(`id:${this.id}-*`);
      const counterNow = Math.ceil(sortedPosts.length / postCountInKey)

      if (pattern.length != 0 && (counterNow < pattern.length)){
        pattern.forEach(async (item) => {
          await this.redisService.del(item)
        })
      }

      for (let i = 0; i < sortedPosts.length; i += postCountInKey) {
        const groupBatch = sortedPosts.slice(i, i + postCountInKey);

        if (groupBatch.length === 0) {
          break;
        }
        const tempKey = `temp:id:${this.id}-${i}-${i + postCountInKey}`;
        const mainKey = `id:${this.id}-${i}-${i + postCountInKey}`;

        // Сначала сохраняем во временный ключ
        await this.redisService.set(tempKey, groupBatch);

        let renameAttempts = 0;

        while (renameAttempts <= 6) {
          const checkKey = await this.redisService.exists(tempKey);
          if (checkKey) {
            await this.redisService.rename(tempKey, mainKey);
            break;
          } else {
            renameAttempts++;
            await this.sleep(1000); // Подождать 1 секунду перед следующей попыткой
          }
          break; // Если успешно, выходим из цикла
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async createTg(item, groups, profiles, identificator, sendMessage, tokenBot, telegramLimiter,) {




    const postText = item?.message;
    if(postText?.length >= 150) {
      return
    }

    // if (sendMessage) this.sendPostToTelegramFromTg(item,groups,profiles, tokenBot, telegramLimiter);

    const obj = {
      identification_post: identificator,
      id_group: groups?.id?.toString() || '', // Первый чат из массива
      name_group: groups?.username || groups?.title || '', // Имя чата или название
      city_group: '', // Город группы (если есть)
      country_group: '', // Страна группы (если есть)
      photo_100_group: '', // Фото группы (если есть)
      first_name_user: profiles?.firstName || '', // Имя пользователя (если есть)
      last_name_user: profiles?.lastName || '', // Фамилия пользователя (если есть)
      userName: profiles?.username || '', // Имя пользователя (если есть)
      city_user: '', // Город пользователя (если есть)
      country_user: '', // Страна пользователя (если есть)
      photo_100_user: '', // Фото пользователя (если есть)
      post_id: item?.id || '', // ID поста
      post_owner_id: item?.peerId?.channelId?.value?.toString() || '', // ID того, кто получил чат, группу
      post_fromId: item?.fromId?.userId?.value?.toString() || item?.peerId?.channelId?.value?.toString() || '', // ID отправителя
      post_date_publish: item?.date, // Дата публикации поста
      post_text: item?.message || '', // Текст поста
      post_type: item?.className || '', // Тип поста (если есть)
      signer_id: item?.fromId?.userId?.value?.toString() || item?.peerId?.channelId?.value?.toString() || '', // ID напис
    }

    console.log(obj)
    return

    return this.repository.save({
      identification_post: identificator,
      id_group: groups?.id?.toString() || '', // Первый чат из массива
      name_group: groups?.username || groups?.title || '', // Имя чата или название
      city_group: '', // Город группы (если есть)
      country_group: '', // Страна группы (если есть)
      photo_100_group: '', // Фото группы (если есть)
      first_name_user: profiles?.firstName || '', // Имя пользователя (если есть)
      last_name_user: profiles?.lastName || '', // Фамилия пользователя (если есть)
      userName: profiles?.username || '', // Имя пользователя (если есть)
      city_user: '', // Город пользователя (если есть)
      country_user: '', // Страна пользователя (если есть)
      photo_100_user: '', // Фото пользователя (если есть)
      post_id: item?.id || '', // ID поста
      post_owner_id: item?.peerId?.channelId?.value?.toString() || '', // ID того, кто получил чат, группу
      post_fromId: item?.fromId?.userId?.value?.toString() || item?.peerId?.channelId?.value?.toString() || '', // ID отправителя
      post_date_publish: item?.date, // Дата публикации поста
      post_text: item?.message || '', // Текст поста
      post_type: item?.className || '', // Тип поста (если есть)
      signer_id: item?.fromId?.userId?.value?.toString() || item?.peerId?.channelId?.value?.toString() || '', // ID напис
    });
  }
  //проверяем язык
  async containsEnglishLetters(str) {
    // Регулярное выражение для поиска букв английского алфавита
    const englishLettersRegex = /[A-Za-z]/;
    // Проверяем строку на соответствие регулярному выражению
    return englishLettersRegex.test(str);
  }
  // создание для ВК
  async createFromVkDataBase(item, groups, profiles, identificator, sendMessage, tokenBot, telegramLimiter,) {

    try {

      const postText = item?.text || item?.post_text;
      if(postText?.length >= 250) {
        return
      }

      const ownerId = String(item?.owner_id).replace('-', '');
      const groupInfo = groups?.find((element) => element?.id == ownerId);
      const profileInfo = profiles?.find(
          (element) => element.id == item?.signer_id || item?.owner_id,
      );

      if (groupInfo?.id == `199727029` ||
          groupInfo?.id == `222707022` ||
          groupInfo?.id == `224879501` ||
          groupInfo?.id == `222783887` ||
          groupInfo?.id == `224877554` ||
          groupInfo?.id == `210182463` ||
          groupInfo?.id == `224877648` ||
          groupInfo?.id == `225537848` ||
          groupInfo?.id == `225537909` ||
          groupInfo?.id == `225537941` ||
          groupInfo?.id == `225538003` ||
          groupInfo?.id == `222873123` ||
          groupInfo?.id == `222873119`
      ) {
        return
      }

      const cityGroup = groupInfo?.city
      const cityUser = profileInfo?.city
      let cityGroupEng;
      let cityUserEng;

      if(cityGroup?.title?.length >= 1) cityGroupEng = await this.containsEnglishLetters(cityGroup?.title);
      if(cityUser?.title?.length >= 1) cityUserEng = await this.containsEnglishLetters(cityUser?.title);

      let groupCityName = null;
      let userCityName = null;

      if(cityGroupEng) {
        const city = await this.citiesService.findByIdVk(cityGroup?.id)
        groupCityName = city?.title
      }
      if(cityUserEng) {
        const city = await this.citiesService.findByIdVk(cityUser?.id)
        userCityName = city?.title
      }

      if (sendMessage) this.sendPostToTelegram(item, tokenBot, telegramLimiter);

      return this.repository.save({
        identification_post: 'vk',
        id_group: groupInfo?.id || item.owner_id || '',
        name_group: groupInfo?.name || '',
        city_group: groupCityName || groupInfo?.city?.title || '',
        country_group: groupInfo?.country?.title || '',
        photo_100_group: groupInfo?.photo_50 || '',
        first_name_user: profileInfo?.first_name || '',
        last_name_user: profileInfo?.last_name || '',
        city_user: userCityName || profileInfo?.city?.title || '',
        country_user: profileInfo?.country?.title || '',
        photo_100_user: profileInfo?.photo_50 || '',
        post_id: item?.id,
        post_owner_id: item?.owner_id,
        post_fromId: item?.from_id,
        post_date_publish: item?.date,
        post_text: item?.text || item?.post_text,
        post_type: item?.type,
        signer_id: item?.signer_id || '',
      });
    } catch (err) {
      this.logsService.error(`Функция добавление постов тюторс- ошибка`, `${err}`,);
    }
  }
  async createIfEmpty(post) {
    const item = post;

    return this.repository.save({
      identification_post: 'vk',
      id_group: item.id_group,
      name_group: item.name_group || '',
      city_group: item.city_group || '',
      country_group: item.country_group || '',
      photo_100_group: item.photo_100_group || '',
      first_name_user: item.first_name_user || '',
      last_name_user: item.last_name_user || '',
      city_user: item.city_user || '',
      country_user: item.country_user || '',
      photo_100_user: item.photo_100_user || '',
      post_id: item.post_id,
      post_owner_id: item.post_owner_id,
      post_fromId: item.post_fromId,
      post_date_publish: item.post_date_publish,
      post_text: item.post_text,
      post_type: item.post_type,
      signer_id: item.signer_id || '',
    });
  }
  async sendPostToTelegram(item, tokenBot, telegramLimiter) {

    try {
      let chatId;

      const messageLines = [
        `Дата публикации:`,
        `${new Date(item?.date * 1000).toLocaleString()}.`,
        `Текст поста:`,
        `${item?.text}.`,
        (item?.signer_id && !String(item.signer_id).includes('-')) ||
        (item?.from_id && !String(item.from_id).includes('-'))
          ? `Пользователь: https://vk.com/id${item?.signer_id || item?.from_id}.`
          : null,
        `Пост: https://vk.com/wall${item?.owner_id}_${item?.id}.`,
      ];

      let imageUrl;
      let messageText;
      if (messageLines) {
        messageText = messageLines.filter((line) => line !== null).join('\n');
      }


      if (item?.text?.includes('матем' || 'матан' || 'алгебр')) {
        imageUrl = 'https://timgotow.ru/uploads/math.jpg';
        chatId = process.env['CHAT_MATH'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.text?.includes('геоме' || 'профил')) {
        chatId = process.env['CHAT_MATH'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.text?.includes('биологи')) {
        imageUrl = 'https://timgotow.ru/uploads/bio.jpg';
        chatId = process.env['CHAT_BIOLOGY'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.text?.includes('хими')) {
        imageUrl = 'https://timgotow.ru/uploads/chem.jpg';
        chatId = process.env['CHAT_BIOLOGY'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }

      if (item?.text?.includes('информат')) {
        imageUrl = 'https://timgotow.ru/uploads/inf.jpg';
        chatId = process.env['CHAT_INFORM'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.text?.includes('истори')) {
        imageUrl = 'https://timgotow.ru/uploads/his.jpg';
        chatId = process.env['CHAT_SOCIAL_HISTORY'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.text?.includes('обществ')) {
        imageUrl = 'https://timgotow.ru/uploads/soci.jpg';
        chatId = process.env['CHAT_SOCIAL_HISTORY'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.text?.includes('литер')) {
        imageUrl = 'https://timgotow.ru/uploads/lit.jpg';
        chatId = process.env['CHAT_RUS'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.text?.includes('рус')) {
        imageUrl = 'https://timgotow.ru/uploads/ru.jpg';
        chatId = process.env["CHAT_RUS"];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.text?.includes('испанс')) {
        imageUrl = 'https://timgotow.ru/uploads/esp.jpg';
        chatId = process.env['CHAT_LANGUAGE'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.text?.includes('китайс')) {
        chatId = process.env['CHAT_LANGUAGE'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.text?.includes('англ')) {
        imageUrl = 'https://timgotow.ru/uploads/en.jpg';
        chatId = process.env['CHAT_LANGUAGE'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.text?.includes('немец')) {
        imageUrl = 'https://timgotow.ru/uploads/ger.jpg';
        chatId = process.env['CHAT_LANGUAGE'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }

      if (item?.text?.includes('физи')) {
        imageUrl = 'https://timgotow.ru/uploads/phy.jpg';
        chatId = process.env['CHAT_PHYSIC'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.text?.includes('2 класс' || '1 кл' || '3 кл' || '4 кл' || 'чтени' || 'первокла' || 'второкла' || 'треьекл' || 'четверок' || 'начал' || 'к школе' || 'школ')) {
        imageUrl = `https://timgotow.ru/uploads/start.jpg`;
        chatId = process.env['CHAT_START'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
    } catch (err) {

      this.logsService.error(
        `Функция sendPostToTelegram - ошибка`,
        `${err}`,
      );
    }
  }
  async sendPostToTelegramFromTg(item, groups, profiles, tokenBot, telegramLimiter) {

    try {
      let chatId;

      const messageLines = [
        `Дата публикации:`,
        `${new Date(item?.date * 1000).toLocaleString()}.`,
        `Текст поста:`,
        `${item?.message}.`,
        (profiles?.userName)
            ? `Пользователь: https://t.me/${profiles?.userName}.`
            : null,
        `Пост: https://t.me/${groups.name_group}/${item.post_id}.`,
      ];

      let imageUrl;
      let messageText;
      if (messageLines) {
        messageText = messageLines.filter((line) => line !== null).join('\n');
      }


      if (item?.message?.includes('матем' || 'матан' || 'алгебр')) {
        imageUrl = 'https://timgotow.ru/uploads/math.jpg';
        chatId = process.env['CHAT_MATH'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.message?.includes('геоме' || 'профил')) {
        chatId = process.env['CHAT_MATH'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.message?.includes('биологи')) {
        imageUrl = 'https://timgotow.ru/uploads/bio.jpg';
        chatId = process.env['CHAT_BIOLOGY'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.message?.includes('хими')) {
        imageUrl = 'https://timgotow.ru/uploads/chem.jpg';
        chatId = process.env['CHAT_BIOLOGY'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }

      if (item?.message?.includes('информат')) {
        imageUrl = 'https://timgotow.ru/uploads/inf.jpg';
        chatId = process.env['CHAT_INFORM'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.message?.includes('истори')) {
        imageUrl = 'https://timgotow.ru/uploads/his.jpg';
        chatId = process.env['CHAT_SOCIAL_HISTORY'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.message?.includes('обществ')) {
        imageUrl = 'https://timgotow.ru/uploads/soci.jpg';
        chatId = process.env['CHAT_SOCIAL_HISTORY'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.message?.includes('литер')) {
        imageUrl = 'https://timgotow.ru/uploads/lit.jpg';
        chatId = process.env['CHAT_RUS'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.message?.includes('рус')) {
        imageUrl = 'https://timgotow.ru/uploads/ru.jpg';
        chatId = process.env["CHAT_RUS"];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.message?.includes('испанс')) {
        imageUrl = 'https://timgotow.ru/uploads/esp.jpg';
        chatId = process.env['CHAT_LANGUAGE'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.message?.includes('китайс')) {
        chatId = process.env['CHAT_LANGUAGE'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.message?.includes('англ')) {
        imageUrl = 'https://timgotow.ru/uploads/en.jpg';
        chatId = process.env['CHAT_LANGUAGE'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.message?.includes('немец')) {
        imageUrl = 'https://timgotow.ru/uploads/ger.jpg';
        chatId = process.env['CHAT_LANGUAGE'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }

      if (item?.message?.includes('физи')) {
        imageUrl = 'https://timgotow.ru/uploads/phy.jpg';
        chatId = process.env['CHAT_PHYSIC'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
      if (item?.message?.includes('2 класс' || '1 кл' || '3 кл' || '4 кл' || 'чтени' || 'первокла' || 'второкла' || 'треьекл' || 'четверок' || 'начал' || 'к школе' || 'школ')) {
        imageUrl = `https://timgotow.ru/uploads/start.jpg`;
        chatId = process.env['CHAT_START'];
        if (messageLines && chatId) {
          await telegramLimiter.schedule(() =>
              this.sendToChat(chatId, messageText, imageUrl, tokenBot),
          );
        }
      }
    } catch (err) {

      this.logsService.error(
          `Функция sendPostToTelegram - ошибка`,
          `${err}`,
      );
    }
  }
  async sendToChat(chatId: string, messageText: string, photoUrl: string, token: string,) {
    try {

      let url;
      let dataToSend;
      if (photoUrl) {
        url = `https://api.telegram.org/bot${token}/sendPhoto`;
        dataToSend = {
          chat_id: chatId,
          caption: messageText,
          photo: photoUrl,
        };
      } else {
        url = `https://api.telegram.org/bot${token}/sendMessage`;
        dataToSend = {
          chat_id: chatId,
          text: messageText,
        };
      }

      const { data } = await firstValueFrom(
        this.httpService.post<any>(url, dataToSend).pipe(
          catchError((error: AxiosError) => {
            if (
              error.response &&
              'data' in error.response &&
              error.response.data != undefined
            ) {
              this.logsService.error(
                `Функция проверки и получению постов с вк - ошибка`,
                `${error}`,
              );
            }
            this.logsService.error(
              `Функция проверки и получению постов с вк - ошибка`,
              `${error}`,
            );
            console.log(error)
            throw 'An error happened!';
          }),
        ),
      );
    } catch (err) {

      this.logsService.error(
          `Функция отправки в телегу sendToChat - ошибка`,
          `${err}`,
      );
    }
  }

}

