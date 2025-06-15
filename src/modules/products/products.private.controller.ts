import {
  Controller,
  Get,
  Headers,
  HttpException,
  Logger,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { WooCommerceKeysTypes } from '../../../constants/WooCommerceKeys.types';
import {
  GetPrivateProductsParamsDto,
  GetProductsParamsDto,
} from './products.dto';

@Controller('private/products')
export class ProductsPrivateController {
  logger = new Logger(ProductsPrivateController.name);

  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(
    @Headers('woocommercekeys') wooCommerceKeys: WooCommerceKeysTypes,
    @Query() params: GetPrivateProductsParamsDto,
  ) {
    try {
      const data = await this.productsService.getPrivateProducts(
        wooCommerceKeys,
        params,
      );
      data.products.forEach((product) => console.log(product.id));

      return { success: true, data };
    } catch (e) {
      console.log(e);
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Get('/public')
  async getPublicProducts(
    @Query() params: GetProductsParamsDto,
    @Headers('merchantid') merchantId: number,
    @Headers('woocommercekeys') wooCommerceKeys: WooCommerceKeysTypes,
  ) {
    try {
      const data = await this.productsService.getProducts(
        params,
        wooCommerceKeys,
        merchantId,
        null,
      );

      return { success: true, data };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
