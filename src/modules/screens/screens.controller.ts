import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Param,
  Post,
  Headers,
} from '@nestjs/common';
import { ScreensService } from './screens.service';
import { CreateScreenDto } from './screens.dto';

@Controller('screens')
export class ScreensController {
  private readonly logger = new Logger(ScreensController.name);
  constructor(private readonly screensService: ScreensService) {}

  @Get('/')
  async getScreens(@Headers('merchantid') merchantId: number) {
    try {
      const response = await this.screensService.getScreens(merchantId);
      return { success: true, screens: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Get(':screenId')
  async getScreenById(@Param('screenId') screenId: string) {
    try {
      const response = await this.screensService.getScreenById(screenId);

      return { success: true, screen: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Post('/')
  async createScreen(
    @Headers('merchantid') merchantId: number,
    @Body() body: CreateScreenDto,
  ) {
    try {
      const response = await this.screensService.createScreen(merchantId, body);

      return { success: true, screens: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
