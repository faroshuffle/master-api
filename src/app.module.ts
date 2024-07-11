import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from '../config/config';
import { PrismaService } from './services/prisma.service';
import { ScreensModule } from './modules/screens/screens.module';
import { PresetsModule } from './modules/presets/presets.module';
import { UploadModule } from './modules/upload/upload.module';
import { WooService } from './services/woo.service';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { MerchantsModule } from './modules/merchants/merchants.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from './services/cache.service';
import { CartModule } from './modules/cart/cart.module';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { StripeService } from './services/stripe.service';
import { EventsModule } from './modules/events/events.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    CacheModule.register({ isGlobal: true }),
    AuthModule,
    ScreensModule,
    PresetsModule,
    UploadModule,
    ProductsModule,
    MerchantsModule,
    CartModule,
    CheckoutModule,
    EventsModule,
    RecommendationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    JwtService,
    PrismaService,
    WooService,
    CacheService,
    StripeService,
  ],
})
export class AppModule {}
