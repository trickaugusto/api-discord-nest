import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DiscordBotModule } from './discord-bot/discord-bot.module';
import { PaymentModule } from './payment/payment.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    DiscordBotModule,
    PaymentModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
