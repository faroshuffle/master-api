import { Module } from '@nestjs/common';
import { PresetsController } from './presets.controller';
import { PrismaService } from '../../services/prisma.service';
import { PresetsService } from './presets.service';
import { ScreensService } from '../screens/screens.service';

@Module({
  controllers: [PresetsController],
  providers: [PrismaService, PresetsService, ScreensService],
})
export class PresetsModule {}
