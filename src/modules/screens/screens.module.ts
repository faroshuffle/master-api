import { Module } from '@nestjs/common';
import { ScreensService } from './screens.service';
import { ScreensController } from './screens.controller';
import { PrismaService } from '../../services/prisma.service';
import { ScreensPublicController } from './screens.public.controller';

@Module({
  controllers: [ScreensController, ScreensPublicController],
  providers: [PrismaService, ScreensService],
})
export class ScreensModule {}
