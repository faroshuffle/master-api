import {
  Controller,
  Get,
  Headers,
  HttpException,
  Logger,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { WooCommerceKeysTypes } from '../../../constants/WooCommerceKeys.types';

@Controller('analytics')
export class AnalyticsController {
  logger = new Logger(AnalyticsController.name);
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('sales-by-month')
  async getSalesByMonth(@Headers('merchantid') merchantId: number) {
    try {
      const response = await this.analyticsService.getSalesByMonth(merchantId);

      return { success: true, response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Get('products-by-month')
  async getProductsByMonth(@Headers('merchantid') merchantId: number) {
    try {
      const response =
        await this.analyticsService.getProductsByMonth(merchantId);

      return { success: true, response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Get('active-users-last-month')
  async getActiveUsersLastMonth(@Headers('merchantid') merchantId: number) {
    try {
      const response =
        await this.analyticsService.getActiveUsersLastMonth(merchantId);

      return { success: true, response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Get('best-performing-product')
  async getBestPerformingProductAllTime(
    @Headers('merchantid') merchantId: number,
    @Headers('woocommercekeys') wooCommerceKeys: WooCommerceKeysTypes,
  ) {
    try {
      const response =
        await this.analyticsService.getBestPerformingProductAllTime(
          merchantId,
          wooCommerceKeys,
        );

      return { success: true, response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
