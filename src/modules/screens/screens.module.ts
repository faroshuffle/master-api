import { Module } from '@nestjs/common';
import { ScreensService } from './screens.service';
import { ScreensController } from './screens.controller';
import { PrismaService } from '../../services/prisma.service';

@Module({
  controllers: [ScreensController],
  providers: [PrismaService, ScreensService],
})
export class ScreensModule {}
