import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  authorizedUserIds?: number[];
}
