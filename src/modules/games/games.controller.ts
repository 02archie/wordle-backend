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
import { UpdateGameDto } from './dto/update-game.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';

// @UseGuards(JwtAuthGuard)
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
      return this.responseOk(Object(game), res);
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
      return this.responseOk(Object(players), res);
    } catch (error) {
      return this.responseWithErrors(error, res);
    }
  }

  // Obtener datos del juego por id
  @Get('/:id')
  async getResultsGame(@Param('id') id: number, @Res() res: Response) {
    try {
      const result = await this.gamesService.getGame(id);
      return this.responseOk(Object(result), res);
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
      return this.responseOk(Object(stadistics), res);
    } catch (error) {
      return this.responseWithErrors(error, res);
    }
  }

  // Actualizar palabra a adivinar por id
  @Put('/:id')
  async updateFindWord(@Param('id') id: number, @Res() res: Response) {
    try {
      const update_word = await this.gamesService.updateFindWord(id);
      return this.responseOk(Object(update_word), res);
    } catch (error) {
      console.log(error);
      return this.responseWithErrors(error, res);
    }
  }

  // Adivinar palabra
  @Put()
  async compareWords(
    @Res() res: Response,
    @Body() updateGameDto: UpdateGameDto,
  ) {
    try {
      const word = await this.gamesService.compareWord(updateGameDto);
      return this.responseOk(Object(word), res);
    } catch (error) {
      return this.responseWithErrors(error, res);
    }
  }

  // @Post('found_word/:word')
  // async foundWord(@Res() res: Response, @Param('word') word: string) {
  //   try {
  //     return await this.gamesService.foundWord(word, ['a', 'b', 'c', 'l']);
  //   } catch (error) {
  //     console.log(error);
  //     return this.responseWithErrors(error, res);
  //   }
  // }
}
