import { Injectable } from '@nestjs/common';
import { WooService } from '../../services/woo.service';
import { WooCommerceKeysTypes } from '../../../constants/WooCommerceKeys.types';
import { AddProductDto, GetProductsDto } from './cart.dto';
import { EventsService } from '../events/events.service';
import { UserActionType } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(
    private readonly wooService: WooService,
    private readonly eventsService: EventsService,
  ) {}

  async addProduct(
    wooCommerceKeys: WooCommerceKeysTypes,
    body: AddProductDto,
    merchantId: number,
    userId: number,
  ) {
    const variation = await this.wooService.getVariationId(
      wooCommerceKeys,
      body,
    );

    await this.eventsService.trackEvent(
      merchantId,
      userId,
      UserActionType.ADD_TO_CART,
      body.productId,
    );

    return variation;
  }

  async getProducts(
    wooCommerceKeys: WooCommerceKeysTypes,
    body: GetProductsDto,
  ) {
    return this.wooService.getCartProducts(wooCommerceKeys, body);
  }
}
