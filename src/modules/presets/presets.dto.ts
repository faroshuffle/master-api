import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

enum PresetTypes {
  BANNER = 'BANNER',
  TEXT = 'TEXT',
}

export class CreatePresetDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber()
  @IsNotEmpty()
  position: number;

  @IsEnum(PresetTypes)
  @IsNotEmpty()
  type: PresetTypes;
}

export class UpdatePresetDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
