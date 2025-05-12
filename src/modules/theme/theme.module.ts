import { Module } from '@nestjs/common';
import { ThemePrivateController } from './theme.private.controller';
import { ThemeService } from './theme.service';
import { PrismaService } from '../../services/prisma.service';
import { ThemePublicController } from './theme.public.controller';

@Module({
  controllers: [ThemePrivateController, ThemePublicController],
  providers: [ThemeService, PrismaService],
})
export class ThemeModule {}
