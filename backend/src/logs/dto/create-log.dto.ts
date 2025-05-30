import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateLogDto {
  @IsString()
  @IsNotEmpty()
  event: string;

  @IsInt()
  userId: number;

  @IsDateString()
  eventDate: string;
}
