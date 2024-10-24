import { Module } from '@nestjs/common';
import { ProductsPublicController } from './products.public.controller';
import { ProductsService } from './products.service';
import { WooService } from '../../services/woo.service';
import { RestClientService } from '../../services/restClient.service';
import { HttpModule } from '@nestjs/axios';
import { ProductsPrivateController } from './products.private.controller';

@Module({
  imports: [HttpModule],
  controllers: [ProductsPublicController, ProductsPrivateController],
  providers: [ProductsService, WooService, RestClientService],
})
export class ProductsModule {}
