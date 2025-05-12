import { IsString } from 'class-validator';

export class NotificationsDto {
  @IsString()
  title: string;

  @IsString()
  subtitle: string;
}

export class TokenDto {
  @IsString()
  token: string;
}
