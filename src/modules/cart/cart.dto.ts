import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AddProductDto {
  @IsNumber()
  productId: number;

  @IsArray()
  @IsString({ each: true })
  attributes: string[];
}

class CartProductDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  variationId: number;
}

export class GetProductsDto {
  @IsArray()
  @ValidateNested()
  @Type(() => CartProductDto)
  data: CartProductDto[];
}
