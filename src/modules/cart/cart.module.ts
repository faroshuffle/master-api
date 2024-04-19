import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { WooService } from '../../services/woo.service';

@Module({
  providers: [CartService, WooService],
  controllers: [CartController],
})
export class CartModule {}
