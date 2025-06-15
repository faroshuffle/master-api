import admin, { ServiceAccount } from 'firebase-admin';
import * as serviceAccount from './dizertatie-5080d-firebase-adminsdk-fbsvc-bb38a527db.json';
import { Injectable } from '@nestjs/common';
import { NotificationsDto } from '../modules/notifications/notifications.dto';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

@Injectable()
export class FirebaseService {
  async sendNotification(tokens: string[], message: NotificationsDto) {
    const messages = tokens.map((token) => ({
      token,
      notification: {
        title: message.title,
        body: message.subtitle,
      },
    }));

    return admin
      .messaging()
      .sendEach(messages)
      .then((response) => {
        console.log(response);
        return response;
      });
  }
}
