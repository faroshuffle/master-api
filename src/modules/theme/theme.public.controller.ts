import {
  Controller,
  Get,
  Headers,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ThemeService } from './theme.service';
import { Public } from 'constants/metadata.constants';

@Public()
@Controller('theme')
export class ThemePublicController {
  private readonly logger = new Logger(ThemePublicController.name);
  constructor(private readonly themeService: ThemeService) {}

  @Get()
  async getActiveTheme(@Headers('merchantid') merchantId: number) {
    try {
      const data = await this.themeService.getActiveTheme(merchantId);

      return { success: true, theme: data };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
