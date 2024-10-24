import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { WooService } from '../../services/woo.service';
import { StripeService } from '../../services/stripe.service';
import { EventsModule } from '../events/events.module';
import { PrismaService } from '../../services/prisma.service';
import { OrdersService } from '../orders/orders.service';

@Module({
  imports: [EventsModule],
  providers: [
    CheckoutService,
    WooService,
    StripeService,
    PrismaService,
    OrdersService,
  ],
  controllers: [CheckoutController],
})
export class CheckoutModule {}
