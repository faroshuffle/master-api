import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { WooService } from '../../services/woo.service';
import { StripeService } from '../../services/stripe.service';

@Module({
  providers: [CheckoutService, WooService, StripeService],
  controllers: [CheckoutController],
})
export class CheckoutModule {}
