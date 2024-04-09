import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import {
  CreatePresetDto,
  ReorderPreset2,
  UpdatePresetDto,
} from './presets.dto';
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
        screenId,
      },
    });
  }

  async createPresetForScreen(screenId: number, body: CreatePresetDto) {
    await this.prismaService.presets.create({
      data: {
        type: body.type,
        position: body.position,
        screen: { connect: { id: screenId } },
      },
    });

    return this.screensService.getScreenById(screenId);
  }

  async updatePresetById(presetId: number, body: UpdatePresetDto) {
    const payload:
      | {
          target: { connect: { id: number } };
          title?: string;
          subtitle?: string;
          image?: string;
          cta?: string;
        }
      | {
          title?: string;
          subtitle?: string;
          image?: string;
          cta?: string;
          targetId?: number;
        } = body.targetId
      ? {
          ...body,
          targetId: undefined,
          target: { connect: { id: body.targetId } },
        }
      : { ...body };

    const { screenId } = await this.prismaService.presets.update({
      where: { id: presetId },
      data: payload,
      select: {
        screenId: true,
      },
    });

    return this.screensService.getScreenById(screenId);
  }

  async reorderPresets(screenId: number, body: ReorderPreset2) {
    for (const preset of body.presets) {
      await this.prismaService.presets.update({
        where: {
          id: preset.id,
        },
        data: {
          position: preset.position,
        },
      });
    }

    return this.screensService.getScreenById(screenId);
  }

  async deletePresetById(presetId: number) {
    const preset = await this.prismaService.presets.delete({
      where: { id: presetId },
    });

    const screen = await this.screensService.getScreenById(preset.screenId);
    const newOrder = screen.presets
      .filter((p) => p.position > preset.position)
      .map((p) => ({ ...p, position: p.position - 1 }));

    return this.reorderPresets(screen.id, { presets: newOrder });
  }
}
