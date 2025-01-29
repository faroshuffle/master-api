import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetOrdersDto {
  @IsNumberString()
  currentPage: string;

  @IsString()
  @IsOptional()
  user: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  startDate: string;

  @IsString()
  @IsOptional()
  endDate: string;
}
