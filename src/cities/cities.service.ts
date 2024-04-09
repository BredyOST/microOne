import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from './entities/city.entity';
import { HttpService } from '@nestjs/axios';
import * as process from 'process';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios/index';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(CityEntity)
    private repository: Repository<CityEntity>,
    private readonly httpService: HttpService,
  ) {}

  async getCityFromVK(postsForRequst) {
    const access = process.env['ACCESS_TOKEN'];
    const versionVk = process.env['VERSION_VK'];
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<any>(
            `https://api.vk.com/method/execute?code=${encodeURIComponent(postsForRequst)}&access_token=${access}&lang=0&v=${versionVk}`,
          )
          .pipe(
            catchError((error: AxiosError) => {
              if (
                error.response &&
                'data' in error.response &&
                error.response.data != undefined
              ) {
              }
              console.log(error)
              throw new Error(
                `getPostsFromVK An error happened! для ${postsForRequst}`,
              );
            }),
          ),
      );

      return data?.response;

      // if (!data || !data.response || typeof data.response !== 'object') {
      //     console.log('нету')
      // }

      // очищаем ответ, удаляя лишнее
      // if (data?.response && typeof data.response === 'object') {
      //   if ('execute_errors' in data.response) {
      //     delete data.response.execute_errors;
      //   }
      // }

      // filteredData.response = Object.fromEntries(
      //     Object.entries(data.response).filter(([key, value]: [string, any]) => {
      //       return (
      //           value !== false &&
      //           (!value.count || value.count !== 0) &&
      //           value.items &&
      //           value.items.length > 0
      //       );
      //     }),
      // );
      // return filteredData;
    } catch (err) {
      console.log(err);
    }
  }

  async findByIdVk(idVkCity) {
    console.log(`==============А ТУТ ДЛЯ ЗАПРОСЫ ДАННЫЕ ${idVkCity}`)
    return await this.repository.findOne({
      where: {
        idVkCity,
      },
    });
  }
  async addToRepository(item) {
    const sameCity = await this.findByIdVk(item.id);

    if (!sameCity) {

      await this.repository.save({
        idVkCity: item.id,
        title: item.title,
      });
    }
  }

  async addCity(ip) {
    let start = 1;
    let end = 500;

    for (let i = 0; start <= Infinity; i++) {
      if(end >= 24000) break
      const idGroups = [];
      for (let o = start; o <= end; o++) {
        idGroups.push(o);
      }

      const code = `
           var cityInfo = API.database.getCitiesById({ city_ids: "${idGroups}" });
           return { cityInfo: cityInfo };`;

      const groups = await this.getCityFromVK(code);

      groups?.cityInfo?.forEach(async (item) => {
        console.log(item)
        await this.addToRepository(item);
      });

      start += 500;
      end += 500;

    }
  }
}
