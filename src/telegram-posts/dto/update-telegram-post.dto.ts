import { PartialType } from '@nestjs/mapped-types';
import { CreateTelegramPostDto } from './create-telegram-post.dto';

export class UpdateTelegramPostDto extends PartialType(CreateTelegramPostDto) {}
