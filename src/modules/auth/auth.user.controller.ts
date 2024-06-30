import { Body, Controller, HttpException, Logger, Post } from '@nestjs/common';
import { Public } from 'constants/metadata.constants';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './auth.dto';

@Public()
@Controller('user')
export class AuthUserController {
  private readonly logger = new Logger(AuthUserController.name);
  constructor(private readonly authService: AuthService) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    try {
      const response = await this.authService.createUser(body);

      return { success: true, accessToken: response.access_token };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    try {
      const response = await this.authService.loginUser(body);

      return { success: true, accessToken: response.access_token };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
