import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../services/prisma.service';
import {
  AddKeys,
  CreateUserDto,
  LoginDto,
  LoginUserDto,
  SignUp,
} from './auth.dto';
import { hash, compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { MerchantsService } from '../merchants/merchants.service';
import { CacheService } from '../../services/cache.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly merchantService: MerchantsService,
    private readonly cacheService: CacheService,
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

    const keys = await this.prismaService.wooCommerceKeys.findFirst({
      where: {
        merchantId: user.id,
      },
    });
    await this.cacheService.storeCache(user.id.toString(), {
      privateKey: keys.privateKey,
      publicKey: keys.publicKey,
    });

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

    const merchant = await this.prismaService.merchants.create({
      data: { ...body, password },
      select: {
        id: true,
      },
    });

    await this.merchantService.generateMerchantDefaults(merchant.id);

    return true;
  }

  async logout(merchantId: number) {
    await this.cacheService.removeCache(merchantId.toString());
  }

  async addKeys(merchantId: number, body: AddKeys) {
    await this.prismaService.wooCommerceKeys.create({
      data: {
        merchant: { connect: { id: merchantId } },
        privateKey: body.privateKey,
        publicKey: body.publicKey,
      },
    });

    await this.cacheService.storeCache(merchantId.toString(), {
      privateKey: body.privateKey,
      publicKey: body.publicKey,
    });
  }

  async createUser(body: CreateUserDto) {
    const password = await hash(body.password, 8);

    const user = await this.prismaService.users.create({
      data: { ...body, password },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

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

  async loginUser(body: LoginUserDto) {
    const user = await this.prismaService.users.findFirst({
      where: { email: body.email },
    });

    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    const isValid = await compare(body.password, user.password);

    if (!isValid) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
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
}
