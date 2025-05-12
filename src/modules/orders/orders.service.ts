import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { WooCommerceKeysTypes } from '../../../constants/WooCommerceKeys.types';
import { WooService } from '../../services/woo.service';
import { GetOrdersDto } from './orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly wooService: WooService,
  ) {}

  async getFilters(merchantId: number) {
    const users = await this.prismaService.orders.groupBy({
      by: ['userId'],
      where: {
        merchant: { id: merchantId },
      },
    });

    const cities = await this.prismaService.orders.groupBy({
      by: ['addressId'],
      where: {
        merchant: { id: merchantId },
      },
    });

    return Promise.all([
      this.prismaService.users.findMany({
        where: {
          id: { in: users.map((i) => i.userId) },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      }),
      this.prismaService.addresses.findMany({
        where: {
          id: { in: cities.map((i) => i.addressId) },
        },
        select: {
          city: true,
        },
      }),
    ]);
  }

  async getOrders(merchantId: number, params: GetOrdersDto) {
    const currentPage = Number(params.currentPage) - 1;
    const filters: any = { user: {}, createdAt: {}, addressId: {} };
    if (params.user) {
      filters.user.id = Number(params.user);
    }
    if (params.startDate) {
      filters.createdAt.gte = new Date(params.startDate);
    }
    if (params.endDate) {
      filters.createdAt.lte = new Date(params.endDate);
    }
    if (params.city) {
      const ids = await this.prismaService.addresses.findMany({
        where: {
          city: params.city,
        },
        select: {
          id: true,
        },
      });

      filters.addressId.in = ids.map((id) => id.id);
    }

    return Promise.all([
      this.prismaService.orders.findMany({
        where: {
          merchant: { id: merchantId },
          ...filters,
        },
        include: {
          user: true,
          address: true,
        },
        take: 10,
        skip: 10 * currentPage,
      }),
      this.prismaService.orders.count({
        where: {
          merchant: { id: merchantId },
        },
      }),
    ]);
  }

  async getOrderProducts(
    orderId: number,
    wooCommerceKeys: WooCommerceKeysTypes,
  ) {
    const products = await this.prismaService.orderedProducts.findMany({
      where: {
        order: { id: orderId },
      },
    });

    const productIds = products.map((p) => p.productId);

    return this.wooService.getOrderProducts(wooCommerceKeys, productIds);
  }

  async saveOrder(
    merchantId: number,
    userId: number,
    products: any,
    shipping: any,
    externalId: number,
    totalPrice: number,
  ) {
    const address = await this.prismaService.addresses.findFirst({
      where: {
        city: shipping.city,
        address1: shipping.address_1,
        postcode: shipping.postCode,
      },
      select: {
        id: true,
      },
    });

    const payload: {
      user: { connect: { id: number } };
      merchant: { connect: { id: number } };
      externalId: number;
      totalPrice: number;
      address?: { connect: { id: number } };
    } = {
      user: { connect: { id: userId } },
      merchant: { connect: { id: merchantId } },
      totalPrice,
      externalId,
    };

    if (address?.id) {
      payload.address = { connect: { id: address.id } };
    }

    const { id: orderId } = await this.prismaService.orders.create({
      data: payload,
    });

    for (const product of products) {
      if (product.variation_id) {
        await this.prismaService.orderedProducts.create({
          data: {
            variationId: product.variation_id,
            productId: product.product_id,
            quantity: product.quantity,
            order: { connect: { id: Number(orderId) } },
            merchant: { connect: { id: merchantId } },
          },
        });

        continue;
      }

      await this.prismaService.orderedProducts.create({
        data: {
          productId: product.product_id,
          quantity: product.quantity,
          order: { connect: { id: Number(orderId) } },
          merchant: { connect: { id: merchantId } },
        },
      });
    }
  }
}
