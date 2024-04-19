import { Injectable } from '@nestjs/common';
import { UpdateWordsSearchDto } from './dto/update-words-search.dto';
import {WordSearchEntity} from "./entities/words-search.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class WordsSearchService {
  constructor(
      @InjectRepository(WordSearchEntity)
      private repository: Repository<WordSearchEntity>,
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
