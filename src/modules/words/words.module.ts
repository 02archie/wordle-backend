import { Module } from '@nestjs/common';

import { WordsController } from './words.controller';

import { WordsService } from './words.service';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  controllers: [WordsController],
  providers: [WordsService, PrismaService],
  exports: [WordsService],
})
export class WordsModule {}
