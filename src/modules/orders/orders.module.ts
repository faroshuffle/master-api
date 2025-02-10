import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../../services/prisma.service';
import { WooService } from '../../services/woo.service';

@Module({
  providers: [OrdersService, PrismaService, WooService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
