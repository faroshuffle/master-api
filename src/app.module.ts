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
import { UsersModule } from './modules/users/users.module';
import { OrdersModule } from './modules/orders/orders.module';
import { BuildsModule } from './modules/builds/builds.module';
import { SocketsService } from './services/sockets.service';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ThemeModule } from './modules/theme/theme.module';
import { FirebaseService } from './services/firebase.service';
import { NotificationsModule } from './modules/notifications/notifications.module';

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
    UsersModule,
    OrdersModule,
    BuildsModule,
    AnalyticsModule,
    ThemeModule,
    NotificationsModule,
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
    SocketsService,
    FirebaseService,
  ],
})
export class AppModule {}
