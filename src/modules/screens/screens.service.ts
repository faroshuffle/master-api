import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { CreateScreenDto } from './screens.dto';

@Injectable()
export class ScreensService {
  constructor(private readonly prismaService: PrismaService) {}

  async getScreens() {
    return this.prismaService.screens.findMany({
      select: {
        id: true,
        name: true,
        is_system: true,
      },
    });
  }

  async getScreenById(screenId: number) {
    return this.prismaService.screens.findUnique({
      where: {
        id: screenId,
      },
      select: {
        id: true,
        name: true,
        is_system: true,
        presets: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });
  }

  async createScreen(body: CreateScreenDto) {
    await this.prismaService.screens.create({
      data: {
        name: body.name,
        is_system: false,
      },
    });

    return this.getScreens();
  }
}
