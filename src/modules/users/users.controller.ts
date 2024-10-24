import {
  Controller,
  Get,
  Headers,
  HttpException,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Headers('merchantid') merchantId: number) {
    try {
      const response = await this.usersService.getUsers(merchantId);
      return { success: true, users: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
