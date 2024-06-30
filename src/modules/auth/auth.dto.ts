import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class SignUp {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;
}

export class AddKeys {
  @IsString()
  publicKey: string;

  @IsString()
  privateKey: string;
}

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}

export class LoginUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
