import { Module } from '@nestjs/common';
import { BuildsController } from './builds.controller';
import { BuildsService } from './builds.service';
import { PrismaService } from '../../services/prisma.service';
import { SocketsService } from '../../services/sockets.service';

@Module({
  controllers: [BuildsController],
  providers: [BuildsService, PrismaService, SocketsService],
})
export class BuildsModule {}
