import {
  Body,
  Controller,
  Headers,
  HttpException,
  Logger,
  Post,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TokenDto } from './notifications.dto';
import { Public } from 'constants/metadata.constants';

@Public()
@Controller('public/notifications')
export class NotificationsPublicController {
  logger = new Logger(NotificationsPublicController.name);
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async saveToken(
    @Headers('merchantid') merchantId: number,
    @Body() body: TokenDto,
  ) {
    console.log(body);
    try {
      await this.notificationsService.saveToken(merchantId, body.token);

      return { success: true };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
