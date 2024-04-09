import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { CreateScreenDto } from './screens.dto';

@Injectable()
export class ScreensService {
  constructor(private readonly prismaService: PrismaService) {}

  async getScreens(merchantId: number) {
    return this.prismaService.screens.findMany({
      where: {
        merchant: { id: merchantId },
      },
      select: {
        id: true,
        name: true,
        isSystem: true,
      },
    });
  }

  async getScreenById(screenId: string | number) {
    if (isNaN(parseFloat(screenId as string))) {
      return this.prismaService.screens.findFirst({
        where: {
          name: screenId as string,
        },
        select: {
          id: true,
          name: true,
          isSystem: true,
          presets: {
            orderBy: {
              position: 'asc',
            },
          },
        },
      });
    }

    return this.prismaService.screens.findUnique({
      where: {
        id: parseInt(screenId as string),
      },
      select: {
        id: true,
        name: true,
        isSystem: true,
        presets: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });
  }

  async createScreen(merchantId: number, body: CreateScreenDto) {
    await this.prismaService.screens.create({
      data: {
        name: body.name,
        isSystem: false,
        merchant: { connect: { id: merchantId } },
      },
    });

    return this.getScreens(merchantId);
  }
}
