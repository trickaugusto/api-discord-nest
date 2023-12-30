import { Module } from '@nestjs/common';
import { DiscordBotService } from './discord-bot.service';
import { DiscordBotController } from './discord-bot.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [DiscordBotController],
  providers: [DiscordBotService],
  imports: [PrismaModule],
})
export class DiscordBotModule {}
