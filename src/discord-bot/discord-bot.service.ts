import { Injectable } from '@nestjs/common';
import { CreateDiscordBotDto } from './dto/create-discord-bot.dto';
import { UpdateDiscordBotDto } from './dto/update-discord-bot.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DiscordBotService {
  constructor(private prisma: PrismaService) {}

  async create(createDiscordBotDto: CreateDiscordBotDto) {
    return this.prisma.bot.create({ data: createDiscordBotDto });
  }

  findAllByOwnerId(owner_id: number) {
    return this.prisma.bot.findMany({ where: { owner_id } });
  }

  findOne(id: number) {
    return this.prisma.bot.findUnique({ where: { id } });
  }

  update(id: number, updateDiscordBotDto: UpdateDiscordBotDto) {
    return this.prisma.bot.update({ where: { id }, data: updateDiscordBotDto });
  }

  remove(id: number) {
    return this.prisma.bot.delete({ where: { id } });
  }
}
