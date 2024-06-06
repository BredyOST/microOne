import { PartialType } from '@nestjs/mapped-types';
import { CreateBeautyDto } from './create-beauty.dto';

export class UpdateBeautyDto extends PartialType(CreateBeautyDto) {}
