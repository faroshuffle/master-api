import { IsNumberString } from 'class-validator';

export class GetProductsParamsDto {
  @IsNumberString()
  currentPage: string;
}
