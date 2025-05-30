import { Type } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @Type(() => String)
  email: string;

  @IsString()
  @Type(() => String)
  password: string;
}
