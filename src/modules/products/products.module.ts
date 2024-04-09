import { Module } from '@nestjs/common';
import { ProductsPublicController } from './products.public.controller';
import { ProductsService } from './products.service';
import { WooService } from '../../services/woo.service';

@Module({
  controllers: [ProductsPublicController],
  providers: [ProductsService, WooService],
})
export class ProductsModule {}
