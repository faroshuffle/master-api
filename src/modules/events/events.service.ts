import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { UserActionType } from '@prisma/client';
import { WooService } from '../../services/woo.service';
import { WooCommerceKeysTypes } from '../../../constants/WooCommerceKeys.types';

@Injectable()
export class EventsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly wooService: WooService,
  ) {}

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

  async getEvents(
    merchantId: number,
    wooCommerceKeys: WooCommerceKeysTypes,
    currentPage: string,
  ) {
    const [events, totalCount] = await Promise.all([
      await this.prismaService.userActions.findMany({
        where: { merchant: { id: merchantId } },
        take: 10,
        skip: 10 * Number(currentPage),
        select: {
          action: true,
          productId: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      await this.prismaService.userActions.count({
        where: {
          merchant: { id: merchantId },
        },
      }),
    ]);

    const productIds = [];
    new Set(events.map((event) => event.productId)).forEach((id) =>
      productIds.push(id),
    );

    const products = productIds.length
      ? await this.wooService.getAnalyticsProducts(productIds, wooCommerceKeys)
      : [];

    return {
      events: events.map((event) => {
        const product = products.find((p) => p.id === event.productId);
        return {
          ...event,
          product,
        };
      }),
      totalCount: Math.ceil(totalCount / 10),
    };
  }
}
