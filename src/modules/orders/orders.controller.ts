import {
  Controller,
  Get,
  Headers,
  HttpException,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { WooCommerceKeysTypes } from '../../../constants/WooCommerceKeys.types';
import { GetOrdersDto } from './orders.dto';

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getOrders(
    @Headers('merchantid') merchantId: number,
    @Query() params: GetOrdersDto,
  ) {
    try {
      const [orders, totalCount] = await this.ordersService.getOrders(
        merchantId,
        params,
      );

      return {
        success: true,
        orders,
        totalPages: Math.ceil(totalCount / 10),
      };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Get(':orderId/products')
  async getOrderProducts(
    @Param('orderId') orderId: string,
    @Headers('woocommercekeys') wooCommerceKeys: WooCommerceKeysTypes,
  ) {
    try {
      const response = await this.ordersService.getOrderProducts(
        Number(orderId),
        wooCommerceKeys,
      );

      return { success: true, products: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
