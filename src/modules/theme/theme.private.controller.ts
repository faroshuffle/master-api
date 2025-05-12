import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ThemeService } from './theme.service';
import { CreateUpdateThemeDto } from './theme.dto';

@Controller('/private/theme')
export class ThemePrivateController {
  private readonly logger = new Logger(ThemePrivateController.name);
  constructor(private readonly themeService: ThemeService) {}

  @Get('/all')
  async getAllThemes(@Headers('merchantid') merchantId: number) {
    try {
      const data = await this.themeService.getAllThemes(merchantId);

      return { success: true, themes: data };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Get(':id')
  async getThemeById(
    @Headers('merchantid') merchantId: number,
    @Param('id') themeId: string,
  ) {
    try {
      const data = await this.themeService.getThemeById(
        merchantId,
        Number(themeId),
      );

      return { success: true, theme: data };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Post()
  async createTheme(
    @Headers('merchantid') merchantId: number,
    @Body() body: CreateUpdateThemeDto,
  ) {
    try {
      const data = await this.themeService.createTheme(merchantId, body);

      return { success: true, theme: data };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Put(':id')
  async updateTheme(
    @Headers('merchantid') merchantId: number,
    @Param('id') themeId: string,
    @Body() body: CreateUpdateThemeDto,
  ) {
    try {
      const data = await this.themeService.updateTheme(
        merchantId,
        Number(themeId),
        body,
      );

      return { success: true, theme: data };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Put(':id/active')
  async setActiveTheme(
    @Headers('merchantid') merchantId: number,
    @Param('id') themeId: string,
  ) {
    try {
      const data = await this.themeService.setActiveTheme(
        merchantId,
        Number(themeId),
      );

      return { success: true, theme: data };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Delete(':id')
  async deleteTheme(
    @Headers('merchantid') merchantId: number,
    @Param('id') themeId: string,
  ) {
    try {
      const data = await this.themeService.deleteTheme(
        merchantId,
        Number(themeId),
      );

      return { success: true, theme: data };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
