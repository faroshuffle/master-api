import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetProductsParamsDto {
  @IsNumberString()
  currentPage: string;

  @IsOptional()
  @IsNumberString()
  category: string;

  @IsOptional()
  @IsNumberString()
  minAmount: string;

  @IsOptional()
  @IsNumberString()
  maxAmount: string;
}

export class GetPrivateProductsParamsDto {
  @IsNumberString()
  currentPage: string;

  @IsString()
  search: string;
}
