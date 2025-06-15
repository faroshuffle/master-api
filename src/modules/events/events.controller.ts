import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { TrackEventDto } from './events.dto';
import { Public } from 'constants/metadata.constants';
import { WooCommerceKeysTypes } from '../../../constants/WooCommerceKeys.types';

@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);
  constructor(private readonly eventsService: EventsService) {}

  @Public()
  @Post('')
  async trackEvent(
    @Headers('merchantid') merchantId: number,
    @Headers('userid') userId: number,
    @Body() body: TrackEventDto,
  ) {
    try {
      if (!userId) {
        return { success: false };
      }

      await this.eventsService.trackEvent(
        merchantId,
        userId,
        body.action,
        Number(body.productId),
      );

      return { success: true };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Get()
  async getEvents(
    @Headers('merchantid') merchantId: number,
    @Headers('woocommercekeys') wooCommerceKeys: WooCommerceKeysTypes,
    @Query('currentPage') currentPage: string,
  ) {
    try {
      const { events, totalCount } = await this.eventsService.getEvents(
        merchantId,
        wooCommerceKeys,
        currentPage,
      );

      return { success: true, data: { events, totalCount } };
    } catch (e) {
      console.log(e);
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
