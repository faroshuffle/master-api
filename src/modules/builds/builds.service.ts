import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { BuildsUpdateSettingsDto } from './builds.dto';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs';
import { exec } from 'child_process';
import { SocketsService } from '../../services/sockets.service';

@Injectable()
export class BuildsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly socketService: SocketsService,
  ) {}

  async getSettings(merchantId: number) {
    return this.prismaService.buildSettings.findFirst({
      where: {
        merchant: { id: merchantId },
      },
    });
  }

  async updateSettings(merchantId: number, body: BuildsUpdateSettingsDto) {
    await this.prismaService.buildSettings.update({
      where: { merchantId },
      data: { ...body },
    });
  }

  async startBuild(merchantId: number) {
    const settings = await this.getSettings(merchantId);

    const fileName = `${this.configService.get('mobileAppDirectory')}/app.json`;
    const config = JSON.parse(fs.readFileSync(fileName, 'utf8'));

    const newConfig = {
      ...config,
      expo: {
        ...config.expo,
        name: settings.appName,
        slug: 'mobile',
        icon: settings.adaptiveImage,
        splash: {
          ...config.expo.splash,
          image: settings.splashImage,
        },
        android: {
          ...config.expo.android,
          package: settings.packageName,
          adaptiveIcon: {
            ...config.expo.android.adaptiveIcon,
            foregroundImage: settings.adaptiveImage,
          },
        },
      },
    };
    fs.writeFileSync(fileName, JSON.stringify(newConfig));

    const buildProcess = exec(
      'cd .. && cd master-mobile && eas build --profile development --platform android --local',
    );
    buildProcess.stdout.on('data', (data) => {
      console.log(data);
      this.socketService.handleSendLogs(data);
    });
    buildProcess.on('close', (code) => {
      console.log(code);
      this.socketService.handleSendExit(code);
    });
  }
}
