import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { CreatePresetDto, UpdatePresetDto } from './presets.dto';
import { ScreensService } from '../screens/screens.service';

@Injectable()
export class PresetsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly screensService: ScreensService,
  ) {}

  async getPresetsByScreenId(screenId: number) {
    return this.prismaService.presets.findMany({
      where: {
        screen_id: screenId,
      },
    });
  }

  async createPresetForScreen(screenId: number, body: CreatePresetDto) {
    await this.prismaService.presets.create({
      data: { ...body, screen_id: screenId },
    });

    return this.screensService.getScreenById(screenId);
  }

  async updatePresetById(presetId: number, body: UpdatePresetDto) {
    const { screen_id } = await this.prismaService.presets.update({
      where: { id: presetId },
      data: body,
      select: {
        screen_id: true,
      },
    });

    return this.screensService.getScreenById(screen_id);
  }
}
