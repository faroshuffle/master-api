import {
  Body,
  Controller,
  HttpException,
  Logger,
  Post,
  Response,
} from '@nestjs/common';
import { Public } from 'constants/metadata.constants';
import { AuthService } from './auth.service';
import { CreateUserDto } from './auth.dto';

@Public()
@Controller('user')
export class AuthUserController {
  private readonly logger = new Logger(AuthUserController.name);
  constructor(private readonly authService: AuthService) {}

  @Post()
  async create(@Body() body: CreateUserDto, @Response() res: any) {
    try {
      const response = await this.authService.createUser(body);
      res
        .cookie('accessToken', response.access_token, {
          expires: new Date(new Date().setDate(new Date().getDate() + 7)),
          sameSite: 'none',
          secure: true,
          httpOnly: true,
        })
        .send({ success: true });
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
