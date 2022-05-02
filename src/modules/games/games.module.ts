import { Module } from '@nestjs/common';
import { WordsModule } from '../words/words.module';

import { GamesService } from './games.service';
import { PrismaService } from '../../services/prisma.service';

import { GamesController } from './games.controller';

@Module({
  imports: [WordsModule],
  controllers: [GamesController],
  providers: [GamesService, PrismaService],
})
export class GamesModule {}
