import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  Logger,
  Param,
  Post,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream, readdirSync } from 'fs';
import { join } from 'path';
import { BuildsUpdateSettingsDto } from './builds.dto';
import { BuildsService } from './builds.service';

@Controller('builds')
export class BuildsController {
  private readonly logger = new Logger(BuildsController.name);

  constructor(private readonly buildsService: BuildsService) {}

  @Get()
  async listBuilds(@Headers('merchantid') merchantId: number) {
    const files = readdirSync(
      join(process.cwd(), 'builds', merchantId.toString()),
    ).map((file) => file);

    return { success: true, files };
  }

  @Get('download/:name')
  async downloadBuild(
    @Headers('merchantid') merchantId: number,
    @Param('name') name: string,
  ) {
    const file = createReadStream(
      join(process.cwd(), 'builds', merchantId.toString(), name),
    );
    return new StreamableFile(file, {
      type: 'application/octet-stream',
      disposition: `attachment; filename="${name}"`,
    });
  }

  @Get('settings')
  async getSettings(@Headers('merchantid') merchantId: number) {
    try {
      const result = await this.buildsService.getSettings(merchantId);

      return { success: true, settings: result };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Post('settings')
  async updateSettings(
    @Headers('merchantid') merchantId: number,
    @Body() body: BuildsUpdateSettingsDto,
  ) {
    try {
      await this.buildsService.updateSettings(merchantId, body);

      return { success: true };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Post('start')
  async startBuild(@Headers('merchantid') merchantId: number) {
    try {
      await this.buildsService.startBuild(merchantId);

      return { success: true };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
