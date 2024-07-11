import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { WooCommerceKeysTypes } from '../../../constants/WooCommerceKeys.types';
import { Public } from 'constants/metadata.constants';

@Controller('checkout')
export class CheckoutController {
  private readonly logger = new Logger(CheckoutController.name);
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get('shipping_zones')
  @Public()
  async getShippingZones(
    @Headers('woocommercekeys') wooCommerceKeys: WooCommerceKeysTypes,
  ) {
    try {
      if (!wooCommerceKeys) {
        return { success: false, data: 'Missing keys' };
      }

      const response =
        await this.checkoutService.getShippingZones(wooCommerceKeys);

      return { success: true, data: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Get(`shipping_zones/:id`)
  @Public()
  async getShippingZone(
    @Headers('woocommercekeys') wooCommerceKeys: WooCommerceKeysTypes,
    @Param('id') zoneId: string,
  ) {
    try {
      if (!wooCommerceKeys) {
        return { success: false, data: 'Missing keys' };
      }

      const response = await this.checkoutService.getShippingZone(
        wooCommerceKeys,
        zoneId,
      );

      return { success: true, data: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Post('payment_intent')
  @Public()
  async getPaymentIntent(@Body() body: { price: number }) {
    try {
      const response = await this.checkoutService.getPaymentIntent(body.price);

      return { success: true, data: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Post('save_order')
  @Public()
  async saveOrder(
    @Headers('merchantid') merchantId: number,
    @Headers('userid') userId: number,
    @Headers('woocommercekeys') wooCommerceKeys: WooCommerceKeysTypes,
    @Body() body: any,
  ) {
    try {
      await this.checkoutService.saveOrder(
        wooCommerceKeys,
        body.checkoutData,
        body.cartData,
        merchantId,
        userId,
      );

      return { success: true };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
