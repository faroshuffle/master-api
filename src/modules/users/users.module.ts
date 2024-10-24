import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../../services/prisma.service';
import { UsersPublicController } from './users.public.controller';

@Module({
  controllers: [UsersController, UsersPublicController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
