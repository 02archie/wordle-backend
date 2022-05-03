import { Injectable } from '@nestjs/common';

import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

import { PrismaService } from '../../services/prisma.service';
import { WordsService } from 'src/modules/words/words.service';

import { Cron } from '@nestjs/schedule';

@Injectable()
export class GamesService {
  public id_game: number;
  public word_user: Array<string>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly wordService: WordsService,
  ) {}

  /*  crear registro cuando el usuario comienza a jugar,
   *  se le asigna una palabra en aleatorio que se almacena en la bd
   */
  async createGame(createGameDto: CreateGameDto) {
    const generate_word = await this.wordService.getOneWord();
    // esta es la palabra que tengo que retornar al usuario cada 5 min
    createGameDto.word = generate_word[0].word;
    createGameDto.word_user ? createGameDto.word_user : null;
    const game = await this.prisma.game.create({ data: createGameDto });
    this.id_game = game.id;
    return game;
  }

  // obtener los resultados
  async getGame(id: number) {
    const game = await this.prisma.game.findUnique({
      where: { id: +id },
      select: {
        id: true,
        word: true,
        word_user: true,
        attempts: true,
        points: true,
        games: true,
        games_won: true,
        player_id: true,
      },
    });
    return game;
  }

  // actualizar palabra a adivinar en la bd
  async updateFindWord(id: number) {
    const generate_word = await this.wordService.getOneWord();
    const game = await this.getGame(id);
    if (!game) {
      console.log('¡La tarea no se pudo realizar, palabra no actualizada 😕!');
      return false;
    } else {
      const update_word = await this.prisma.game.update({
        where: { id: +id },
        data: {
          word: generate_word[0].word,
          games: game.games + 1,
          attempts: 0,
        },
      });
      console.log('¡Tarea realizada, palabra actualizada 😬!');
      return update_word;
    }
  }

  // Compara letra con todas las posiciones de un array
  async foundWord(word: string, id_game: number) {
    // cuando se compare la palabra se actualiza el campo "attempts" 1, y este numero lo tomo como una posicion del arreglo para validar el la letra
    const game = await this.getGame(id_game);
    const list = game.word.split('');

    // si los intentos son menores a 5 entonces actualiza la información de la bd
    if (game.attempts < 5) {
      // se va formando la palabra con cada intento
      await this.updateWord(id_game, word);

      // se encuentra en la misma posición
      const found = list.indexOf(word, game.attempts);
      // se encuentra en otra posición o no se encuentra
      const found_out = list.indexOf(word);

      if (found >= 0) {
        // si la letra existe y se encuentra en la misma posicion
        const response = {
          letter: word,
          value: 1,
        };
        // aumenta un intento al usuario
        await this.aumentAtempt(id_game, game.attempts + 1);
        return response;
      } else if (found_out !== game.attempts && found_out >= 0) {
        // si la letra existe pero no se encuentra en la misma posicion
        const response = {
          letter: word,
          value: 2,
        };
        // aumenta un intento al usuario
        await this.aumentAtempt(id_game, game.attempts + 1);
        return response;
      } else if (found == -1 || found_out == -1) {
        // si la letra no existe en la palabra
        const response = {
          letter: word,
          value: 3,
        };
        // aumenta un intento al usuario
        await this.aumentAtempt(id_game, game.attempts + 1);
        return response;
      }
    } else {
      // se comparan la palabra a adivinar con la palabra formada, si no coinciden se queda el campo NULL, pero si si coinciden se queda guardada
      await this.compareWords(id_game);
      return 'Ya no tienes mas intentos, revisa las estadisticas de tu partida. 😕';
    }
  }

  // comparar palabras
  async compareWords(id_game: number) {
    const game = await this.getGame(id_game);
    const word = game.word;
    const word_user = game.word_user;
    if (word === word_user) {
      // si coinciden entonces se aumenta 1 a un contador para ver cuales son las palabras mas adivinadas
      await this.wordService.countFound(word);
      // Se  queda guardada la palabra y se aumenta una partida jugada y una ganada
      await this.prisma.game.update({
        where: { id: +id_game },
        data: {
          games: game.games + 1,
          games_won: game.games_won + 1,
        },
      });
      return '¡Las palabras coinciden! 😬';
    } else {
      console.log('NO ES IGUAL');
      // No se guarda la palabra y se aumenta una partida jugada
      await this.prisma.game.update({
        where: { id: +id_game },
        data: { word_user: null, games: game.games + 1 },
      });
      return 'Las palabras no coinciden. 😕';
    }
  }

  // aumentar intento
  async aumentAtempt(id_game: number, attempt: number) {
    const aument_attempt = await this.prisma.game.update({
      where: { id: +id_game },
      data: { attempts: attempt },
    });
    return aument_attempt;
  }

  /* voy a guardar letra por letra en la bd sumando los string, intento por intento,
   *si al final la palabra completa coincide con la palabra a adivinar la dejo, si no la pongo como null
   */
  async updateWord(id_game: number, letter: string) {
    const game = await this.getGame(id_game);
    const aument_word = await this.prisma.game.update({
      where: { id: +id_game },
      data: { word_user: game.word_user + letter },
    });
    return aument_word;
  }

  // obtener estadisticas de partidas
  async getStadistics(id: number) {
    const game = await this.prisma.game.findUnique({
      where: { id: +id },
      select: {
        id: true,
        games: true,
        games_won: true,
      },
    });
    return game;
  }

  // obtener los 10 mejores jugadores
  async getBestPlayers() {
    const players = await this.prisma.game.findMany({
      where: { deleted_at: null },
      orderBy: [{ points: 'desc' }],
      take: 10,
      include: {
        users: true,
      },
    });
    return players;
  }

  // tarea programada que se ejecuta cada 5 minutos y actualiza la palabra a adivinar
  @Cron('*/5 * * * *')
  async getNewWordCron() {
    console.log('¡Tarea programada en proceso 😬!');
    return await this.updateFindWord(this.id_game);
  }
}
