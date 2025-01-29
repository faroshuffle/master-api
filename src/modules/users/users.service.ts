import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import {
  ChangeUserData,
  ChangeUserPassword,
  CreateAddressDto,
} from './users.dto';
import { compare, hash } from 'bcrypt';
import { GetPrivateProductsParamsDto } from '../products/products.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUsers(merchantId: number, params: GetPrivateProductsParamsDto) {
    const currentPage = Number(params.currentPage) - 1;

    return Promise.all([
      this.prismaService.users.findMany({
        where: {
          merchant: { id: merchantId },
        },
        take: 10,
        skip: 10 * currentPage,
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          _count: {
            select: {
              Orders: true,
            },
          },
        },
      }),
      this.prismaService.users.count({
        where: {
          merchant: { id: merchantId },
        },
      }),
    ]);
  }

  async getPublicUser(merchantId: number, userId: number) {
    return this.prismaService.users.findUnique({
      where: {
        id: userId,
        merchant: { id: merchantId },
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    });
  }

  async changeUserData(userId: number, body: ChangeUserData) {
    await this.prismaService.users.update({
      where: {
        id: userId,
      },
      data: {
        ...body,
      },
    });
  }

  async changeUserPassword(userId: number, body: ChangeUserPassword) {
    const user = await this.prismaService.users.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('Not found', HttpStatus.UNAUTHORIZED);
    }

    const isValid = await compare(body.oldPassword, user.password);

    if (!isValid) {
      return { success: false, message: 'Old password does not match' };
    }

    const newPassword = await hash(body.newPassword, 8);

    await this.prismaService.users.update({
      where: { id: userId },
      data: { password: newPassword },
    });
  }

  async getPublicAddresses(userId: number) {
    return this.prismaService.addresses.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async createAddress(userId: number, data: CreateAddressDto) {
    const addresses = await this.getPublicAddresses(userId);
    const isFirstAddress = !addresses.length;

    await this.prismaService.addresses.create({
      data: {
        country: data.country,
        city: data.city,
        address1: data.address1,
        address2: data.address2,
        postcode: data.postcode,
        user: { connect: { id: userId } },
        isActive: isFirstAddress,
      },
    });

    return true;
  }

  async getOrders(userId: number) {}
}
