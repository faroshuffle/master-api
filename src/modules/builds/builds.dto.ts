import { IsOptional, IsString } from 'class-validator';

export class BuildsUpdateSettingsDto {
  @IsString()
  @IsOptional()
  appName: string;

  @IsString()
  @IsOptional()
  packageName: string;

  @IsString()
  @IsOptional()
  splashImage: string;

  @IsString()
  @IsOptional()
  adaptiveImage: string;
}
