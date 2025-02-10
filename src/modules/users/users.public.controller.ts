import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  Logger,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ChangeUserData,
  ChangeUserPassword,
  CreateAddressDto,
} from './users.dto';
import { Public } from 'constants/metadata.constants';
import { WooCommerceKeysTypes } from '../../../constants/WooCommerceKeys.types';
import { OrdersService } from '../orders/orders.service';

@Public()
@Controller('/public/users')
export class UsersPublicController {
  logger = new Logger(UsersPublicController.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

  @Get()
  async getUser(
    @Headers('merchantid') merchantId: number,
    @Headers('userid') userId: number,
  ) {
    try {
      if (!userId) {
        return { success: true, user: null };
      }
      const response = await this.usersService.getPublicUser(
        merchantId,
        userId,
      );
      return { success: true, user: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Patch()
  async changeUserData(
    @Headers('userid') userId: number,
    @Body() body: ChangeUserData,
  ) {
    try {
      await this.usersService.changeUserData(userId, body);
      return { success: true };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Patch('password')
  async changeUserPassword(
    @Headers('userid') userId: number,
    @Body() body: ChangeUserPassword,
  ) {
    try {
      const response = await this.usersService.changeUserPassword(userId, body);
      return { success: true, error: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Get('addresses')
  async getAddresses(@Headers('userid') userId: number) {
    try {
      const response = await this.usersService.getPublicAddresses(userId);
      return { success: true, addresses: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Put('addresses/:id')
  async updateActiveAddress(
    @Headers('userid') userId: number,
    @Param('id') addressId: string,
  ) {
    try {
      const response = await this.usersService.updateActiveAddress(
        userId,
        Number(addressId),
      );
      return { success: true, addresses: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Delete('addresses/:id')
  async deleteAddress(
    @Headers('userid') userId: number,
    @Param('id') addressId: string,
  ) {
    try {
      const response = await this.usersService.deleteAddress(
        userId,
        Number(addressId),
      );
      return { success: true, addresses: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Post('addresses')
  async createAddress(
    @Headers('userid') userId: number,
    @Body() data: CreateAddressDto,
  ) {
    try {
      await this.usersService.createAddress(userId, data);
      return { success: true };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Get('orders')
  async getOrders(@Headers('userid') userId: number) {
    try {
      const orders = await this.usersService.getOrders(userId);
      return { success: true, orders };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Get('/orders/:orderId/products')
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
