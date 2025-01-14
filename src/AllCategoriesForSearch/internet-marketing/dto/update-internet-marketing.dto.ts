import { PartialType } from '@nestjs/mapped-types';
import { CreateInternetMarketingDto } from './create-internet-marketing.dto';

export class UpdateInternetMarketingDto extends PartialType(CreateInternetMarketingDto) {}
