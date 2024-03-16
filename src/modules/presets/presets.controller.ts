import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PresetsService } from './presets.service';
import { CreatePresetDto, UpdatePresetDto } from './presets.dto';

@Controller('presets')
export class PresetsController {
  private readonly logger = new Logger(PresetsController.name);
  constructor(private readonly presetsService: PresetsService) {}

  @Get(':screenId')
  async getPresetsByScreenId(@Param('screenId') screenId: string) {
    try {
      const response = await this.presetsService.getPresetsByScreenId(
        parseInt(screenId),
      );

      return { success: true, presets: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Post(':screenId')
  async createPresetForScreen(
    @Param('screenId') screenId: string,
    @Body() body: CreatePresetDto,
  ) {
    try {
      const response = await this.presetsService.createPresetForScreen(
        parseInt(screenId),
        body,
      );

      return { success: true, screen: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Put(':presetId')
  async updatePresetById(
    @Param('presetId') presetId: string,
    @Body() body: UpdatePresetDto,
  ) {
    try {
      const response = await this.presetsService.updatePresetById(
        parseInt(presetId),
        body,
      );

      return { success: true, screen: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
