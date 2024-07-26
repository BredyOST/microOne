import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomMadeFurnitureDto } from './create-custom-made-furniture.dto';

export class UpdateCustomMadeFurnitureDto extends PartialType(CreateCustomMadeFurnitureDto) {}
