import { Injectable } from '@nestjs/common';
import { CreateDiscordBotDto } from './dto/create-discord-bot.dto';
import { UpdateDiscordBotDto } from './dto/update-discord-bot.dto';

@Injectable()
export class DiscordBotService {
  create(createDiscordBotDto: CreateDiscordBotDto) {
    return 'This action adds a new discordBot';
  }

  findAll() {
    return `This action returns all discordBot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} discordBot`;
  }

  update(id: number, updateDiscordBotDto: UpdateDiscordBotDto) {
    return `This action updates a #${id} discordBot`;
  }

  remove(id: number) {
    return `This action removes a #${id} discordBot`;
  }
}
