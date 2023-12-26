import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiscordBotService } from './discord-bot.service';
import { CreateDiscordBotDto } from './dto/create-discord-bot.dto';
import { UpdateDiscordBotDto } from './dto/update-discord-bot.dto';

@Controller('discord-bot')
export class DiscordBotController {
  constructor(private readonly discordBotService: DiscordBotService) {}

  @Post()
  create(@Body() createDiscordBotDto: CreateDiscordBotDto) {
    return this.discordBotService.create(createDiscordBotDto);
  }

  @Get()
  findAll() {
    return this.discordBotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discordBotService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiscordBotDto: UpdateDiscordBotDto) {
    return this.discordBotService.update(+id, updateDiscordBotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discordBotService.remove(+id);
  }
}
