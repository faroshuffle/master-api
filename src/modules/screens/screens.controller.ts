import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ScreensService } from './screens.service';
import { CreateScreenDto } from './screens.dto';

@Controller('screens')
export class ScreensController {
  private readonly logger = new Logger(ScreensController.name);
  constructor(private readonly screensService: ScreensService) {}

  @Get('/')
  async getScreens() {
    try {
      const response = await this.screensService.getScreens();

      return { success: true, screens: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Get(':screenId')
  async getScreenById(@Param('screenId') screenId: string) {
    try {
      const response = await this.screensService.getScreenById(
        parseInt(screenId),
      );

      return { success: true, screen: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Post('/')
  async createScreen(@Body() body: CreateScreenDto) {
    try {
      const response = await this.screensService.createScreen(body);

      return { success: true, screens: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
