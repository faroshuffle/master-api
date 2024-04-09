import { Injectable } from '@nestjs/common';
import { WooService } from '../../services/woo.service';
import { GetProductsParamsDto } from './products.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly wooService: WooService) {}

  async getProducts(params: GetProductsParamsDto) {
    return this.wooService.getPublicProducts(params);
  }

  async getProductById(id: string) {
    return this.wooService.getPublicProductById(id);
  }
}
