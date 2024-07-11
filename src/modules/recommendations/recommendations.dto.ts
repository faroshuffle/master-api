import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class RecommendationsDto {
  @IsNumber()
  @IsNotEmpty()
  view: number;

  @IsNumber()
  @IsNotEmpty()
  favorite: number;

  @IsNumber()
  @IsNotEmpty()
  cart: number;

  @IsNumber()
  @IsNotEmpty()
  order: number;

  @IsNumber()
  @IsNotEmpty()
  view_timeout: number;

  @IsBoolean()
  @IsNotEmpty()
  show_after_order: boolean;
}
