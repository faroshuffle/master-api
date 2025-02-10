import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsNumber()
  id: number;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  address1: string;

  @IsString()
  postcode: string;

  @IsOptional()
  @IsString()
  address2: string;
}

export class ChangeUserData {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;
}

export class ChangeUserPassword {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}
