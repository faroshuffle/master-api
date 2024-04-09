import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

enum PresetTypes {
  BANNER = 'BANNER',
  TEXT = 'TEXT',
  CARD = 'CARD',
  FULL_PAGE = 'FULL_PAGE',
}

export class CreatePresetDto {
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

  @IsString()
  @IsOptional()
  cta?: string;

  @IsNumber()
  @IsOptional()
  targetId?: number;
}

export class ReorderPreset {
  @IsNumber()
  id: number;

  @IsNumber()
  position: number;
}

export class ReorderPreset2 {
  @IsArray()
  @ValidateNested()
  @Type(() => ReorderPreset)
  presets: ReorderPreset[];
}
