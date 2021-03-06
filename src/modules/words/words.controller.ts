import { Controller, Get, Res, UseGuards } from '@nestjs/common';

import { AppController } from '../../app.controller';

import { WordsService } from './words.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('words')
export class WordsController extends AppController {
  constructor(private readonly wordsService: WordsService) {
    super();
  }

  // Obtener una palabra en aleatorio de maximo y minimo 5 letras
  @Get()
  async getOneWord(@Res() res: Response) {
    try {
      const word = await this.wordsService.getOneWord();
      return this.responseOk(word, res);
    } catch (error) {
      return this.responseWithErrors(error, res);
    }
  }

  @Get('more_found')
  async getWordsMoreFound(@Res() res: Response) {
    try {
      const words = await this.wordsService.getWordsMoreFound();
      return this.responseOk({ count: words.length, words: words }, res);
    } catch (error) {
      return this.responseWithErrors(error, res);
    }
  }
}
