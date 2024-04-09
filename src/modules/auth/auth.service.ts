import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../services/prisma.service';
import { LoginDto, SignUp } from './auth.dto';
import { hash, compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async login(body: LoginDto) {
    const user = await this.prismaService.merchants.findFirst({
      where: { username: body.username },
    });

    if (!user) {
      throw new HttpException('Not found', HttpStatus.UNAUTHORIZED);
    }

    const isValid = await compare(body.password, user.password);

    if (!isValid) {
      throw new HttpException('Not found', HttpStatus.UNAUTHORIZED);
    }

    return {
      access_token: await this.jwtService.signAsync(
        {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        { secret: this.configService.get('jwt_secret') },
      ),
    };
  }

  async signUp(body: SignUp) {
    const password = await hash(body.password, 8);

    await this.prismaService.merchants.create({
      data: { ...body, password },
    });

    return true;
  }
}
