import { Injectable } from '@nestjs/common';
import { WooService } from '../../services/woo.service';
import { WooCommerceKeysTypes } from '../../../constants/WooCommerceKeys.types';
import { StripeService } from '../../services/stripe.service';
import { EventsService } from '../events/events.service';
import { UserActionType } from '@prisma/client';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly wooService: WooService,
    private readonly stripeService: StripeService,
    private readonly eventsService: EventsService,
  ) {}

  async getShippingZones(wooCommerceKeys: WooCommerceKeysTypes) {
    return this.wooService.getShippingZones(wooCommerceKeys);
  }

  async getShippingZone(wooCommerceKeys: WooCommerceKeysTypes, zoneId: string) {
    return this.wooService.getShippingZoneDetails(wooCommerceKeys, zoneId);
  }

  async saveOrder(
    wooCommerceKeys: WooCommerceKeysTypes,
    checkoutData: any,
    cartData: any,
    merchantId: number,
    userId: number,
  ) {
    await this.wooService.saveOrder(wooCommerceKeys, checkoutData, cartData);

    for (const product of cartData) {
      await this.eventsService.trackEvent(
        merchantId,
        userId,
        UserActionType.ORDER,
        product.id,
      );
    }
  }

  async getPaymentIntent(price: number) {
    return this.stripeService.createPaymentIntent(price);
  }
}
