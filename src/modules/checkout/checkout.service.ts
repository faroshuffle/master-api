import { Injectable } from '@nestjs/common';
import { WooService } from '../../services/woo.service';
import { WooCommerceKeysTypes } from '../../../constants/WooCommerceKeys.types';
import { StripeService } from '../../services/stripe.service';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly wooService: WooService,
    private readonly stripeService: StripeService,
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
  ) {
    return this.wooService.saveOrder(wooCommerceKeys, checkoutData, cartData);
  }

  async getPaymentIntent(price: number) {
    return this.stripeService.createPaymentIntent(price);
  }
}
