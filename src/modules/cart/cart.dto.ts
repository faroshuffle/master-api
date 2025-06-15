import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Attribute {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  option: string;
}

export class AddProductDto {
  @IsNumber()
  productId: number;

  @IsArray()
  @ValidateNested()
  @Type(() => Attribute)
  attributes: Attribute[];
}

class CartProductDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @IsOptional()
  variationId: number;
}

export class GetProductsDto {
  @IsArray()
  @ValidateNested()
  @Type(() => CartProductDto)
  data: CartProductDto[];
}
