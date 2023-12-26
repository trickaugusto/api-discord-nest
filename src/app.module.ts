import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DiscordBotModule } from './discord-bot/discord-bot.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [UsersModule, DiscordBotModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
