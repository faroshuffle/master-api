import { UserActionType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class TrackEventDto {
  @IsEnum(UserActionType)
  @IsNotEmpty()
  action: UserActionType;

  @IsString()
  @IsNotEmpty()
  productId: string;
}
