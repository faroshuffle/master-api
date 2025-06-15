import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaService } from '../../services/prisma.service';
import { WooService } from '../../services/woo.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService, PrismaService, WooService],
  exports: [EventsService],
})
export class EventsModule {}
