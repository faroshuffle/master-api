import { Injectable } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello() {
    return this.prisma.presets.findMany();
  }
}
