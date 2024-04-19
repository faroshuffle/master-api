import {
  Controller,
  Get,
  Headers,
  HttpException,
  Logger,
} from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { WooCommerceKeysTypes } from '../../../constants/WooCommerceKeys.types';

@Controller('merchants')
export class MerchantsController {
  private readonly logger = new Logger(MerchantsController.name);
  constructor(private readonly merchantsService: MerchantsService) {}

  @Get()
  async getMe(
    @Headers('merchantid') merchantId: number,
    @Headers('woocommercekeys') wooCommerceKeys: WooCommerceKeysTypes,
  ) {
    try {
      if (!wooCommerceKeys) {
        return { success: false, data: 'Missing keys' };
      }

      const response = await this.merchantsService.getMe(merchantId);

      return { success: true, data: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
