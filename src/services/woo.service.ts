import { Injectable } from '@nestjs/common';
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import { ConfigService } from '@nestjs/config';
import { GetProductsParamsDto } from '../modules/products/products.dto';
import { WooCommerceKeysTypes } from '../../constants/WooCommerceKeys.types';
import { AddProductDto, GetProductsDto } from '../modules/cart/cart.dto';

@Injectable()
export class WooService {
  private wooCommerce: WooCommerceRestApi;

  constructor(private readonly configService: ConfigService) {}

  _getWooCommerceInstance(wooCommerceKeys: WooCommerceKeysTypes) {
    if (!this.wooCommerce) {
      this.wooCommerce = new WooCommerceRestApi({
        url: 'http://localhost/',
        consumerSecret: wooCommerceKeys.privateKey,
        consumerKey: wooCommerceKeys.publicKey,
        version: 'wc/v3',
      });
    }

    return this.wooCommerce;
  }

  async getPublicProducts(
    { currentPage = '1' }: GetProductsParamsDto,
    wooCommerceKeys: WooCommerceKeysTypes,
  ) {
    try {
      const rest = this._getWooCommerceInstance(wooCommerceKeys);

      const { data, headers } = await rest.get('products', {
        stock_status: 'instock',
        status: 'publish',
        per_page: 10,
        page: parseInt(currentPage),
      });

      return {
        products: data.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          on_sale: product.on_sale,
          total_count: headers['wp-total-count'],
          images: product.images
            .slice(0, 2)
            .map((image) =>
              image.src.replace(
                'http://localhost',
                this.configService.get('localhost_src_replacement'),
              ),
            ),
        })),
        totalCount: headers['x-wp-total'],
        totalPages: headers['X-WP-TotalPages'],
      };
    } catch (e) {
      console.log(e);
    }
  }

  async getPublicProductById(
    id: string,
    wooCommerceKeys: WooCommerceKeysTypes,
  ) {
    const rest = this._getWooCommerceInstance(wooCommerceKeys);
    const { data } = await rest.get(`products/${id}`);

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      on_sale: data.on_sale,
      images: data.images.map((image) =>
        image.src.replace(
          'http://localhost',
          this.configService.get('localhost_src_replacement'),
        ),
      ),
      attributes: data.attributes,
      default_attributes: data.default_attributes,
    };
  }

  async getVariationId(
    wooCommerceKeys: WooCommerceKeysTypes,
    body: AddProductDto,
  ) {
    const rest = this._getWooCommerceInstance(wooCommerceKeys);
    const { data } = await rest.get(`products/${body.productId}/variations`, {
      search: body.attributes.join(','),
    });

    return data[0].id;
  }

  async getCartProducts(
    wooCommerceKeys: WooCommerceKeysTypes,
    body: GetProductsDto,
  ) {
    //[{"productId": 45, "variationId": 47}, {"productId": 100, "variationId": 105}, {"productId": 84, "variationId": 86}]
    const rest = this._getWooCommerceInstance(wooCommerceKeys);
    const response = [];

    for (const obj of body.data) {
      const { data: product } = await rest.get(`products/${obj.productId}`);
      const { data } = (await rest.get(
        `products/${obj.productId}/variations/${obj.variationId}`,
      )) as { data: ProductType };

      response.push({
        id: data.id,
        name: product.name,
        price: data.price,
        on_sale: data.on_sale,
        image: data.image.src.replace(
          'http://localhost',
          this.configService.get('localhost_src_replacement'),
        ),
      });
    }

    return response;
  }
}
