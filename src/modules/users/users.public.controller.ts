import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  Logger,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ChangeUserData,
  ChangeUserPassword,
  CreateAddressDto,
} from './users.dto';
import { Public } from 'constants/metadata.constants';

@Public()
@Controller('/public/users')
export class UsersPublicController {
  logger = new Logger(UsersPublicController.name);
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUser(
    @Headers('merchantid') merchantId: number,
    @Headers('userid') userId: number,
  ) {
    try {
      const response = await this.usersService.getPublicUser(
        merchantId,
        userId,
      );
      return { success: true, user: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Patch()
  async changeUserData(
    @Headers('userid') userId: number,
    @Body() body: ChangeUserData,
  ) {
    try {
      await this.usersService.changeUserData(userId, body);
      return { success: true };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Patch('password')
  async changeUserPassword(
    @Headers('userid') userId: number,
    @Body() body: ChangeUserPassword,
  ) {
    try {
      const response = await this.usersService.changeUserPassword(userId, body);
      return { success: true, error: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Get('addresses')
  async getAddresses(@Headers('userid') userId: number) {
    try {
      const response = await this.usersService.getPublicAddresses(userId);
      return { success: true, addresses: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Post('addresses')
  async createAddress(
    @Headers('userid') userId: number,
    @Body() data: CreateAddressDto,
  ) {
    try {
      await this.usersService.createAddress(userId, data);
      return { success: true };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Get('orders')
  async getOrders(@Headers('userid') userId: number) {
    try {
      await this.usersService.getOrders(userId);
      return { success: true };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
