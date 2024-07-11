import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { UserActionType } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  async trackEvent(
    merchantId: number,
    userId: number,
    action: UserActionType,
    productId: number,
  ) {
    if (action === UserActionType.VIEW) {
      // 5 minutes ago
      const minutesAgo = new Date(Date.now() - 5000 * 60);

      const recentAction = await this.prismaService.userActions.findMany({
        where: {
          userId,
          action,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      });

      if (
        recentAction[0]?.productId === productId &&
        recentAction[0]?.createdAt >= minutesAgo
      ) {
        return;
      }
    }

    return this.prismaService.userActions.create({
      data: {
        merchant: { connect: { id: merchantId } },
        user: { connect: { id: userId } },
        action,
        productId: productId,
      },
    });
  }
}
