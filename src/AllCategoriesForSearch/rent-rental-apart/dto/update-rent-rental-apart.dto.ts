import { PartialType } from '@nestjs/mapped-types';
import { CreateRentRentalApartDto } from './create-rent-rental-apart.dto';

export class UpdateRentRentalApartDto extends PartialType(CreateRentRentalApartDto) {}
