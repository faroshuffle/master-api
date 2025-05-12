import { IsString } from 'class-validator';

export class CreateUpdateThemeDto {
  @IsString()
  background: string;

  @IsString()
  primary: string;

  @IsString()
  border: string;

  @IsString()
  card: string;

  @IsString()
  text: string;

  @IsString()
  notification: string;
}
