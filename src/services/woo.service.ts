import { Injectable } from '@nestjs/common';
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import { ConfigService } from '@nestjs/config';
import { GetProductsParamsDto } from '../modules/products/products.dto';

@Injectable()
export class WooService {
  private wooCommerce: WooCommerceRestApi;

  constructor(
    configService: ConfigService,
    private readonly config: ConfigService,
  ) {
    this.wooCommerce = new WooCommerceRestApi({
      url: 'http://localhost/',
      consumerSecret: configService.get('woo_commerce_private_key'),
      consumerKey: configService.get('woo_commerce_public_key'),
      version: 'wc/v3',
    });
  }

  async getPublicProducts({ currentPage = '1' }: GetProductsParamsDto) {
    try {
      const { data, headers } = await this.wooCommerce.get('products', {
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
          images: product.images.map((image) =>
            image.src.replace(
              'http://localhost',
              this.config.get('localhost_src_replacement'),
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

  async getPublicProductById(id: string) {
    const { data } = await this.wooCommerce.get(`products/${id}`);
    console.log(data);

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      on_sale: data.on_sale,
      images: data.images.map((image) =>
        image.src.replace(
          'http://localhost',
          this.config.get('localhost_src_replacement'),
        ),
      ),
      attributes: data.attributes,
      default_attributes: data.default_attributes,
    };
  }
}
