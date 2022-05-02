import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { WordsModule } from './modules/words/words.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GamesModule } from './modules/games/games.module';

import { AppService } from './app.service';
import { PrismaService } from './services/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    WordsModule,
    ScheduleModule,
    GamesModule
  ],
  providers: [AppService, PrismaService],
})
export class AppModule {}
