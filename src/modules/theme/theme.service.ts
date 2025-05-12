import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { CreateUpdateThemeDto } from './theme.dto';

@Injectable()
export class ThemeService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveTheme(merchantId: number) {
    return this.prisma.themes.findFirst({
      where: {
        merchant: { id: merchantId },
        isActive: true,
      },
      select: {
        background: true,
        primary: true,
        border: true,
        card: true,
        text: true,
        notification: true,
      },
    });
  }

  async getAllThemes(merchantId: number) {
    return this.prisma.themes.findMany({
      where: {
        merchant: { id: merchantId },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getThemeById(merchantId: number, themeId: number) {
    return this.prisma.themes.findFirst({
      where: {
        merchant: { id: merchantId },
        id: themeId,
      },
    });
  }

  async createTheme(merchantId: number, body: CreateUpdateThemeDto) {
    return this.prisma.themes.create({
      data: {
        merchant: { connect: { id: merchantId } },
        isActive: false,
        ...body,
      },
    });
  }

  async updateTheme(
    merchantId: number,
    id: number,
    body: CreateUpdateThemeDto,
  ) {
    return this.prisma.themes.update({
      where: {
        merchant: { id: merchantId },
        id,
      },
      data: {
        ...body,
      },
    });
  }

  async setActiveTheme(merchantId: number, id: number) {
    await this.prisma.themes.updateMany({
      where: {
        merchant: { id: merchantId },
      },
      data: {
        isActive: false,
      },
    });

    return this.prisma.themes.update({
      where: {
        merchant: { id: merchantId },
        id,
      },
      data: {
        isActive: true,
      },
    });
  }

  async deleteTheme(merchantId: number, id: number) {
    return this.prisma.themes.delete({
      where: {
        merchant: { id: merchantId },
        id,
      },
    });
  }
}
