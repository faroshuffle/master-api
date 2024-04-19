import { Injectable } from '@nestjs/common';
import { WooService } from '../../services/woo.service';
import { WooCommerceKeysTypes } from '../../../constants/WooCommerceKeys.types';
import { AddProductDto, GetProductsDto } from './cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly wooService: WooService) {}

  async addProduct(wooCommerceKeys: WooCommerceKeysTypes, body: AddProductDto) {
    return this.wooService.getVariationId(wooCommerceKeys, body);
  }

  async getProducts(
    wooCommerceKeys: WooCommerceKeysTypes,
    body: GetProductsDto,
  ) {
    return this.wooService.getCartProducts(wooCommerceKeys, body);
  }
}
