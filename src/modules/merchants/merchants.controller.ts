import {
  Controller,
  Get,
  Headers,
  HttpException,
  Logger,
} from '@nestjs/common';
import { MerchantsService } from './merchants.service';

@Controller('merchants')
export class MerchantsController {
  private readonly logger = new Logger(MerchantsController.name);
  constructor(private readonly merchantsService: MerchantsService) {}

  @Get()
  async getMe(@Headers('merchantid') merchantId: number) {
    try {
      const response = await this.merchantsService.getMe(merchantId);

      return { success: true, data: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
