import {
  Body,
  Controller,
  HttpException,
  Logger,
  Post,
  Response,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AddKeys, LoginDto, SignUp } from './auth.dto';
import { Public } from 'constants/metadata.constants';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto, @Response() res: any) {
    try {
      const response = await this.authService.login(body);
      res
        .cookie('accessToken', response.access_token, {
          expires: new Date(new Date().setDate(new Date().getDate() + 7)),
          sameSite: 'none',
          secure: true,
          httpOnly: true,
        })
        .send({ success: true, data: { hasKeys: response.hasKeys } });
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Public()
  @Post('signUp')
  async signUp(@Body() body: SignUp) {
    try {
      const response = await this.authService.signUp(body);

      return { success: true, data: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Post('keys')
  async addKeys(
    @Headers('merchantid') merchantId: number,
    @Body() body: AddKeys,
  ) {
    try {
      const response = await this.authService.addKeys(merchantId, body);

      return { success: true, data: response };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Post('logout')
  async logout(
    @Headers('merchantid') merchantId: number,
    @Response() res: any,
  ) {
    await this.authService.logout(merchantId);

    res.clearCookie('accessToken').send({ success: true });
  }
}
