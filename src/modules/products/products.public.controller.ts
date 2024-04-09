import {
  Controller,
  Get,
  HttpException,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetProductsParamsDto } from './products.dto';

@Controller('products')
export class ProductsPublicController {
  logger = new Logger(ProductsPublicController.name);
  constructor(private readonly productsService: ProductsService) {}

  @Get('')
  async getProducts(@Query() params: GetProductsParamsDto) {
    try {
      const data = await this.productsService.getProducts(params);

      return { success: true, data };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    try {
      const data = await this.productsService.getProductById(id);
      console.log(data);
      return { success: true, data };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
