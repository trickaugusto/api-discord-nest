import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { DiscordBotService } from './discord-bot.service';
import { CreateDiscordBotDto } from './dto/create-discord-bot.dto';
import { UpdateDiscordBotDto } from './dto/update-discord-bot.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { DiscordBotEntity } from './entities/discord-bot.entity';

@Controller('discord-bot')
export class DiscordBotController {
  constructor(private readonly discordBotService: DiscordBotService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createDiscordBotDto: CreateDiscordBotDto) {
    return new DiscordBotEntity(
      await this.discordBotService.create(createDiscordBotDto),
    );
  }

  @Get('owner/:owner_id')
  async findAllByOwnerId(@Param('owner_id', ParseIntPipe) owner_id: number) {
    const botList = await this.discordBotService.findAllByOwnerId(owner_id);

    return botList.map((bot) => new DiscordBotEntity(bot));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const bot = await this.discordBotService.findOne(id);

    if (!bot) {
      throw new NotFoundException(`Bot #${id} not found`);
    }

    return new DiscordBotEntity(bot);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDiscordBotDto: UpdateDiscordBotDto,
  ) {
    const bot = await this.discordBotService.findOne(id);

    if (!bot) {
      throw new NotFoundException(`Bot #${id} not found`);
    }

    return new DiscordBotEntity(
      await this.discordBotService.update(id, updateDiscordBotDto),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const bot = await this.discordBotService.findOne(id);

    if (!bot) {
      throw new NotFoundException(`Bot #${id} not found`);
    }

    return new DiscordBotEntity(await this.discordBotService.remove(id));
  }
}
