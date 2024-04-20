import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {WordsSearchTgEntity} from "./entities/words-search-tg.entity";

@Injectable()
export class WordsSearchTgService {

  constructor(
      @InjectRepository(WordsSearchTgEntity)
      private repository: Repository<WordsSearchTgEntity>,
  ){}

  findAll() {
    return this.repository.find()
  }

  async findById(id: number) {
    return this.repository.findOneBy({
      id,
    })
  }

  async update(dto) {
    await this.repository.update(dto.id, dto)
  }

}
