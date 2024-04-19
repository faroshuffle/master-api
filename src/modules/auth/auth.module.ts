import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../services/prisma.service';
import { MerchantsModule } from '../merchants/merchants.module';
import { CacheService } from '../../services/cache.service';

@Module({
  imports: [MerchantsModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, PrismaService, CacheService],
})
export class AuthModule {}
