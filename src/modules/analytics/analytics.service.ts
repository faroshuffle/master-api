import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import {
  getSalesByMonth,
  getProductsByMonth,
  getActiveUsersLastMonth,
  getBestPerformingProductAllTime,
  getMostSoldProduct,
} from '@prisma/client/sql';
import { WooService } from '../../services/woo.service';
import { WooCommerceKeysTypes } from '../../../constants/WooCommerceKeys.types';

const _mapNumberToMonth = (month: number) => {
  switch (month) {
    case 0:
      return 'January';
    case 1:
      return 'February';
    case 2:
      return 'March';
    case 3:
      return 'April';
    case 4:
      return 'May';
    case 5:
      return 'June';
    case 6:
      return 'July';
    case 7:
      return 'August';
    case 8:
      return 'September';
    case 9:
      return 'October';
    case 10:
      return 'November';
    case 11:
      return 'December';
  }
};

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly wooService: WooService,
  ) {}

  _formatProductsByMonth(productsByMonth: getProductsByMonth.Result[]) {
    return productsByMonth.reduce((prevValue, currValue) => {
      const existingValue = prevValue.find(
        (val) =>
          val.month === _mapNumberToMonth(new Date(currValue.month).getMonth()),
      );

      if (existingValue) {
        if (
          Object.keys(existingValue).filter((key) => key !== 'month').length ===
          3
        ) {
          return prevValue;
        }
        return prevValue.map((val) => {
          if (
            val.month ===
            _mapNumberToMonth(new Date(currValue.month).getMonth())
          ) {
            return { ...val, [currValue.productid]: currValue.score };
          }

          return val;
        });
      }

      return [
        ...prevValue,
        {
          month: _mapNumberToMonth(new Date(currValue.month).getMonth()),
          [currValue.productid]: currValue.score,
        },
      ];
    }, []);
  }

  _formatSalesByMonth(salesByMonth: getSalesByMonth.Result[]) {
    return salesByMonth.map((sale) => ({
      total_amount:
        Math.round((sale.total_amount + Number.EPSILON) * 100) / 100,
      month: _mapNumberToMonth(new Date(sale.month).getMonth()),
    }));
  }

  async getSalesByMonth(merchantId: number) {
    const salesByMonth = await this.prismaService.$queryRawTyped(
      getSalesByMonth(merchantId),
    );

    return this._formatSalesByMonth(salesByMonth);
  }

  async getProductsByMonth(merchantId: number) {
    const productsByMonth = await this.prismaService.$queryRawTyped(
      getProductsByMonth(merchantId),
    );

    return this._formatProductsByMonth(productsByMonth);
  }

  async getActiveUsersLastMonth(merchantId: number) {
    const [activeUsersLastMonth] = await this.prismaService.$queryRawTyped(
      getActiveUsersLastMonth(merchantId),
    );

    return Number(activeUsersLastMonth.count);
  }

  async getBestPerformingProductAllTime(
    merchantId: number,
    wooCommerceKeys: WooCommerceKeysTypes,
  ) {
    const [tempBestPerformingProductAllTime] =
      await this.prismaService.$queryRawTyped(
        getBestPerformingProductAllTime(merchantId),
      );

    const [bestPerformingProductAllTime] =
      await this.wooService.getAnalyticsProducts(
        [tempBestPerformingProductAllTime.product_id],
        wooCommerceKeys,
      );

    return {
      id: bestPerformingProductAllTime.id,
      name: bestPerformingProductAllTime.name,
      image: bestPerformingProductAllTime.image,
      score: Number(tempBestPerformingProductAllTime.score),
    };
  }

  async getMostSoldProduct(
    merchantId: number,
    wooCommerceKeys: WooCommerceKeysTypes,
  ) {
    const [tempBestPerformingProductAllTime] =
      await this.prismaService.$queryRawTyped(getMostSoldProduct(merchantId));
    const [bestPerformingProductAllTime] =
      await this.wooService.getAnalyticsProducts(
        [tempBestPerformingProductAllTime.product_id],
        wooCommerceKeys,
      );

    return {
      id: bestPerformingProductAllTime.id,
      name: bestPerformingProductAllTime.name,
      image: bestPerformingProductAllTime.image,
      orders: Number(tempBestPerformingProductAllTime.count),
    };
  }
}
