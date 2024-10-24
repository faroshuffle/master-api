import { IsNumberString, IsString } from 'class-validator';

export class GetProductsParamsDto {
  @IsNumberString()
  currentPage: string;
}

export class GetPrivateProductsParamsDto {
  @IsNumberString()
  currentPage: string;

  @IsString()
  search: string;
}
