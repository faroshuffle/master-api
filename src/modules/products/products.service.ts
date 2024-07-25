import { Injectable } from '@nestjs/common';
import { WooService } from '../../services/woo.service';
import { GetProductsParamsDto } from './products.dto';
import { WooCommerceKeysTypes } from '../../../constants/WooCommerceKeys.types';
import { ConfigService } from '@nestjs/config';
import { RestClientService } from '../../services/restClient.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly wooService: WooService,
    private readonly configService: ConfigService,
    private readonly restClient: RestClientService,
  ) {}

  async getProducts(
    params: GetProductsParamsDto,
    wooCommerceKeys: WooCommerceKeysTypes,
  ) {
    // await this.getRecommendedProducts(1, 1, wooCommerceKeys);
    return this.wooService.getPublicProducts(params, wooCommerceKeys);
  }

  async getProductById(id: string, wooCommerceKeys: WooCommerceKeysTypes) {
    const { products: similar } = await this.getSimilarProducts(
      1,
      Number(id),
      wooCommerceKeys,
    );
    const product = await this.wooService.getPublicProductById(
      id,
      wooCommerceKeys,
    );

    return {
      similar,
      product,
    };
  }

  async getAllCategories(wooCommerceKeys: WooCommerceKeysTypes) {
    return this.wooService.getAllCategories(wooCommerceKeys);
  }

  async getRecommendedProducts(
    merchantId: number,
    userId: number,
    wooCommerceKeys: WooCommerceKeysTypes,
  ) {
    const productIds = await this.restClient.get({
      url: `${this.configService.get('recommendationServiceUrl')}/recommend`,
      requestOptions: {
        params: { merchant_id: merchantId, user_id: userId },
      },
    });

    const products = await this.wooService.getProductsByIds(
      productIds,
      wooCommerceKeys,
    );

    // console.log(products);
  }

  async getSimilarProducts(
    merchantId: number,
    productId: number,
    wooCommerceKeys: WooCommerceKeysTypes,
  ) {
    const productIds = await this.restClient.get({
      url: `${this.configService.get('recommendationServiceUrl')}/similar`,
      requestOptions: {
        params: { merchant_id: merchantId, product_id: productId, top_n: 3 },
      },
    });

    return this.wooService.getProductsByIds(productIds, wooCommerceKeys);
  }
}
