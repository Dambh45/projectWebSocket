import { Type } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @Type(() => String)
  email: string;

  @IsString()
  @Type(() => String)
  password: string;

  @IsString()
  @Type(() => String)
  firstname: string;

  @IsString()
  @Type(() => String)
  lastname: string;
}
