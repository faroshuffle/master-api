import {
  Controller,
  Post,
  Headers,
  Body,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Public } from 'constants/metadata.constants';
import { CartService } from './cart.service';
import { WooCommerceKeysTypes } from '../../../constants/WooCommerceKeys.types';
import { AddProductDto, GetProductsDto } from './cart.dto';

@Public()
@Controller('cart')
export class CartController {
  private readonly logger = new Logger(CartController.name);
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addProduct(
    @Headers('woocommercekeys') wooCommerceKeys: WooCommerceKeysTypes,
    @Body() body: AddProductDto,
  ) {
    try {
      const response = await this.cartService.addProduct(wooCommerceKeys, body);

      return { success: true, data: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Post('current')
  async getProducts(
    @Headers('woocommercekeys') wooCommerceKeys: WooCommerceKeysTypes,
    @Body() body: GetProductsDto,
  ) {
    try {
      const response = await this.cartService.getProducts(
        wooCommerceKeys,
        body,
      );

      return { success: true, data: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
