import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { WooService } from '../../services/woo.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [EventsModule],
  providers: [CartService, WooService],
  controllers: [CartController],
})
export class CartModule {}
