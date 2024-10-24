import { IsNumberString } from 'class-validator';

export class GetOrdersDto {
  @IsNumberString()
  currentPage: string;
}
