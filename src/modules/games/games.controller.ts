import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  Param,
  Put,
} from '@nestjs/common';

import { GamesService } from './games.service';

import { AppController } from '../../app.controller';

import { CreateGameDto } from './dto/create-game.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('games')
export class GamesController extends AppController {
  constructor(private readonly gamesService: GamesService) {
    super();
  }

  // Crear registro con la información de partida
  @Post()
  async createGame(@Body() createGameDto: CreateGameDto, @Res() res: Response) {
    try {
      const game = await this.gamesService.createGame(createGameDto);
      return this.responseOk(game, res);
    } catch (error) {
      console.log(error);

      return this.responseWithErrors(error, res);
    }
  }

  // Obtener los 10 mejores jugadores, se obtienen los que más puntos tienen
  @Get('/best_players')
  async getBestPlayers(@Res() res: Response) {
    try {
      const players = await this.gamesService.getBestPlayers();
      return this.responseOk(players, res);
    } catch (error) {
      return this.responseWithErrors(error, res);
    }
  }

  // Obtener datos del juego por id
  @Get('/:id')
  async getResultsGame(@Param('id') id: number, @Res() res: Response) {
    try {
      const result = await this.gamesService.getGame(id);
      return this.responseOk(result, res);
    } catch (error) {
      console.log(error);

      return this.responseWithErrors(error, res);
    }
  }

  // Obtener estadisticas de juego por id
  @Get('/stadistics/:id')
  async getStadistics(@Param('id') id: number, @Res() res: Response) {
    try {
      const stadistics = await this.gamesService.getStadistics(id);
      return this.responseOk(stadistics, res);
    } catch (error) {
      return this.responseWithErrors(error, res);
    }
  }

  // Actualizar palabra a adivinar por id
  @Put('/:id')
  async updateFindWord(@Param('id') id: number, @Res() res: Response) {
    try {
      const update_word = await this.gamesService.updateFindWord(id);
      return this.responseOk(update_word, res);
    } catch (error) {
      console.log(error);
      return this.responseWithErrors(error, res);
    }
  }

  // encontrar letra en la palabra a adivinar
  @Put('found_word/:id/:word')
  async foundWord(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('word') word: string,
  ) {
    try {
      const found = await this.gamesService.foundWord(word, id);
      return this.responseOk(found, res);
    } catch (error) {
      console.log(error);
      return this.responseWithErrors(error, res);
    }
  }
}
