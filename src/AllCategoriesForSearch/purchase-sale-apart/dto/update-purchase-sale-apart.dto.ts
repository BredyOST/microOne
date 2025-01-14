import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseSaleApartDto } from './create-purchase-sale-apart.dto';

export class UpdatePurchaseSaleApartDto extends PartialType(CreatePurchaseSaleApartDto) {}
