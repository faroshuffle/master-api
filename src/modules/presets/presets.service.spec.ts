import { PresetsService } from './presets.service';
import { PrismaService } from '../../services/prisma.service';
import { ScreensService } from '../screens/screens.service';

describe('PresetsService', () => {
  let presetService: PresetsService;
  beforeAll(() => {
    const prismaService = new PrismaService();
    presetService = new PresetsService(
      prismaService,
      new ScreensService(prismaService),
    );
  });
  it.only('should have 4 presets', async () => {
    const response = await presetService.getPresetsByScreenId(1);
    expect(response.length).toBe(4);
  });

  it('should have the same screen id', async () => {
    const response = await presetService.getPresetsByScreenId(1);
    response.forEach((preset) => {
      expect(preset.screenId).toBe(1);
    });
  });

  it('should be ordered', async () => {
    const response = await presetService.getPresetsByScreenId(1);
    response.forEach((preset, index) => {
      expect(preset.position).toBe(index);
    });
  });

  it('should have a valid type', async () => {
    const response = await presetService.getPresetsByScreenId(1);
    response.forEach((preset) => {
      expect(['TEXT', 'BANNER', 'FULL_PAGE'].includes(preset.type)).toBe(true);
    });
  });

  it('test', () => {
    expect(true).toBe(true);
  });

  it('test', () => {
    expect(true).toBe(true);
  });
});
