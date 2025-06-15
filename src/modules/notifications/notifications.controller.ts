import {
  Body,
  Controller,
  Headers,
  HttpException,
  Logger,
  Post,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsDto } from './notifications.dto';

@Controller('notifications')
export class NotificationsController {
  logger = new Logger(NotificationsController.name);
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async sendNotification(
    @Headers('merchantid') merchantId: number,
    @Body() body: NotificationsDto,
  ) {
    try {
      const response = await this.notificationsService.sendNotification(
        merchantId,
        body,
      );

      return { success: true, count: response.successCount };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
