import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { NotificationsDto } from './notifications.dto';
import { FirebaseService } from '../../services/firebase.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async saveToken(merchantId: number, token: string) {
    const isTokenSaved = await this.prisma.firebaseTokens.findFirst({
      where: {
        merchant: { id: merchantId },
        token,
      },
    });

    if (isTokenSaved) {
      return;
    }

    await this.prisma.firebaseTokens.create({
      data: { merchant: { connect: { id: merchantId } }, token },
    });
  }

  async sendNotification(merchantId: number, message: NotificationsDto) {
    const tokensDb = await this.prisma.firebaseTokens.findMany({
      where: {
        merchant: { id: merchantId },
      },
      select: {
        token: true,
      },
    });
    const tokens = tokensDb.map((token) => token.token);

    return this.firebaseService.sendNotification(tokens, message);
  }
}
