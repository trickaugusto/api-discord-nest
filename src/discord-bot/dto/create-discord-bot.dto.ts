import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateDiscordBotDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsInt()
  @IsNotEmpty()
  owner_id: number;
}
