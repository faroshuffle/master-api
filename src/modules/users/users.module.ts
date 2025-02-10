import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../../services/prisma.service';
import { UsersPublicController } from './users.public.controller';
import { OrdersService } from '../orders/orders.service';
import { WooService } from '../../services/woo.service';

@Module({
  controllers: [UsersController, UsersPublicController],
  providers: [WooService, UsersService, PrismaService, OrdersService],
})
export class UsersModule {}
