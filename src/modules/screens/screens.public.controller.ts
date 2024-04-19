import {
  Controller,
  Get,
  Headers,
  HttpException,
  Logger,
  Param,
} from '@nestjs/common';
import { Public } from 'constants/metadata.constants';
import { ScreensService } from './screens.service';

@Public()
@Controller('screens')
export class ScreensPublicController {
  private readonly logger = new Logger(ScreensPublicController.name);

  constructor(private readonly screensService: ScreensService) {}

  @Get('/public/all')
  async getScreens(@Headers('merchantid') merchantId: number) {
    try {
      const response = await this.screensService.getScreens(merchantId);
      return { success: true, screens: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Get('/public/:screenId')
  async getScreenById(@Param('screenId') screenId: string) {
    try {
      const response = await this.screensService.getScreenById(screenId);

      return { success: true, screen: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
