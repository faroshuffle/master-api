import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { FirebaseService } from '../../services/firebase.service';
import { NotificationsPublicController } from './notifications.controller.public';
import { PrismaService } from '../../services/prisma.service';

@Module({
  providers: [NotificationsService, FirebaseService, PrismaService],
  controllers: [NotificationsController, NotificationsPublicController],
})
export class NotificationsModule {}
