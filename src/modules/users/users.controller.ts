import {
  Controller,
  Get,
  Headers,
  HttpException,
  Logger,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { GetPrivateProductsParamsDto } from '../products/products.dto';

@Controller('users')
export class UsersController {
  logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(
    @Headers('merchantid') merchantId: number,
    @Query() params: GetPrivateProductsParamsDto,
  ) {
    try {
      const [users, totalCount] = await this.usersService.getUsers(
        merchantId,
        params,
      );
      return { success: true, users, totalPages: Math.ceil(totalCount / 10) };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
