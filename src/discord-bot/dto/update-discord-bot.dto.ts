import { PartialType } from '@nestjs/mapped-types';
import { CreateDiscordBotDto } from './create-discord-bot.dto';

export class UpdateDiscordBotDto extends PartialType(CreateDiscordBotDto) {}
