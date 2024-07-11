import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { RecommendationsDto } from './recommendations.dto';

@Injectable()
export class RecommendationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getRecommendationsSettings(merchantId: number) {
    return this.prismaService.recommendationsSettings.findUnique({
      where: {
        merchantId,
      },
    });
  }

  async updateRecommendationsSettings(
    merchantId: number,
    data: RecommendationsDto,
  ) {
    return this.prismaService.recommendationsSettings.update({
      where: { merchantId },
      data,
    });
  }
}
