import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';

@Injectable()
export class MerchantsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMe(merchantId: number) {
    return this.prismaService.merchants.findUnique({
      where: {
        id: merchantId,
      },
      select: {
        firstName: true,
        lastName: true,
        username: true,
        email: true,
      },
    });
  }

  async generateMerchantDefaults(merchantId: number) {
    await this.prismaService.screens.create({
      data: {
        name: 'Home',
        isSystem: true,
        merchant: { connect: { id: merchantId } },
      },
    });
  }
}
