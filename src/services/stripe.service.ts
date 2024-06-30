import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(configService: ConfigService) {
    this.stripe = new Stripe(configService.get('stripe_private_key'));
  }

  async createPaymentIntent(price) {
    const intent = await this.stripe.paymentIntents.create({
      amount: Math.round((price + Number.EPSILON) * 100),
      currency: 'RON',
    });

    return {
      paymentIntent: intent.client_secret,
    };
  }
}
