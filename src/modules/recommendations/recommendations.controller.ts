import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  Logger,
  Post,
} from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsDto } from './recommendations.dto';

@Controller('recommendations')
export class RecommendationsController {
  private readonly logger = new Logger(RecommendationsController.name);
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get()
  async getRecommendationsSettings(@Headers('merchantid') merchantId: number) {
    try {
      const data =
        await this.recommendationsService.getRecommendationsSettings(
          merchantId,
        );

      return { success: true, data };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Post()
  async updateRecommendationsSettings(
    @Headers('merchantid') merchantId: number,
    @Body() body: RecommendationsDto,
  ) {
    try {
      const data =
        await this.recommendationsService.updateRecommendationsSettings(
          merchantId,
          body,
        );

      return { success: true, data };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
