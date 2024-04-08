import {Controller, Get, Post} from '@nestjs/common';
import { CitiesService } from './cities.service';
import {serverConfig} from "../posts/serverConfig";

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get('/add')
  async addCity() {
    if(serverConfig?.servers?.length >= 1 ){
      const ip = serverConfig?.servers?.[0].ip
          return this.citiesService.addCity(ip)
    }
    }
  }
