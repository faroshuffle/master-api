import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../../services/prisma.service';
import { WooService } from '../../services/woo.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, PrismaService, WooService],
})
export class AnalyticsModule {}
