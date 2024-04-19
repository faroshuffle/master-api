import { Injectable } from '@nestjs/common';
import { WooService } from '../../services/woo.service';
import { GetProductsParamsDto } from './products.dto';
import { WooCommerceKeysTypes } from '../../../constants/WooCommerceKeys.types';

@Injectable()
export class ProductsService {
  constructor(private readonly wooService: WooService) {}

  async getProducts(
    params: GetProductsParamsDto,
    wooCommerceKeys: WooCommerceKeysTypes,
  ) {
    return this.wooService.getPublicProducts(params, wooCommerceKeys);
  }

  async getProductById(id: string, wooCommerceKeys: WooCommerceKeysTypes) {
    return this.wooService.getPublicProductById(id, wooCommerceKeys);
  }
}
