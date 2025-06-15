import { Injectable } from '@nestjs/common';
import { WooService } from '../../services/woo.service';
import { WooCommerceKeysTypes } from '../../../constants/WooCommerceKeys.types';
import { StripeService } from '../../services/stripe.service';
import { EventsService } from '../events/events.service';
import { UserActionType } from '@prisma/client';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly wooService: WooService,
    private readonly stripeService: StripeService,
    private readonly eventsService: EventsService,
    private readonly ordersService: OrdersService,
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
    const getTotalPrice = () =>
      cartData?.reduce((previousValue: any, currentValue: any) => {
        return (
          previousValue + Number(currentValue.price) * currentValue.quantity
        );
      }, 0) as number;

    const totalPrice =
      Math.round(
        (getTotalPrice() + checkoutData.shipping.price + Number.EPSILON) * 100,
      ) / 100;

    const products = cartData.map((item) => {
      if (item.variationId) {
        return {
          product_id: item.product_id,
          variation_id: item.variationId,
          quantity: item.quantity,
        };
      }

      return {
        product_id: item.product_id,
        quantity: item.quantity,
      };
    });

    const shipping = {
      first_name: checkoutData.shippingAddress.firstName,
      last_name: checkoutData.shippingAddress.lastName,
      country: 'RO',
      city: checkoutData.shippingAddress.city,
      postCode: checkoutData.shippingAddress.postCode,
      address_1: checkoutData.shippingAddress.address,
    };

    const orderId = await this.wooService.saveOrder(
      wooCommerceKeys,
      checkoutData,
      products,
      shipping,
    );

    for (const product of cartData) {
      await this.eventsService.trackEvent(
        merchantId,
        userId,
        UserActionType.ORDER,
        product.product_id,
      );
    }

    await this.ordersService.saveOrder(
      merchantId,
      userId,
      products,
      shipping,
      orderId,
      totalPrice,
    );
  }

  async getPaymentIntent(price: number) {
    return this.stripeService.createPaymentIntent(price);
  }
}
