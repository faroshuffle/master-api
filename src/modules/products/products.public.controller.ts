import {
  Controller,
  Get,
  Headers,
  HttpException,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetProductsParamsDto } from './products.dto';
import { Public } from 'constants/metadata.constants';
import { WooCommerceKeysTypes } from '../../../constants/WooCommerceKeys.types';

@Public()
@Controller('products')
export class ProductsPublicController {
  logger = new Logger(ProductsPublicController.name);
  constructor(private readonly productsService: ProductsService) {}

  @Get('')
  async getProducts(
    @Query() params: GetProductsParamsDto,
    @Headers('woocommercekeys') wooCommerceKeys: WooCommerceKeysTypes,
  ) {
    try {
      const data = await this.productsService.getProducts(
        params,
        wooCommerceKeys,
      );

      return { success: true, data };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Get(':id')
  async getProductById(
    @Param('id') id: string,
    @Headers('woocommercekeys') wooCommerceKeys: WooCommerceKeysTypes,
  ) {
    try {
      const data = await this.productsService.getProductById(
        id,
        wooCommerceKeys,
      );

      return { success: true, data };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
