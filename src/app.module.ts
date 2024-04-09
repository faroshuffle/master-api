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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    AuthModule,
    ScreensModule,
    PresetsModule,
    UploadModule,
    ProductsModule,
    MerchantsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    JwtService,
    PrismaService,
    WooService,
  ],
})
export class AppModule {}
