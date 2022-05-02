import { Injectable } from '@nestjs/common';

import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

import { PrismaService } from '../../services/prisma.service';
import { WordsService } from 'src/modules/words/words.service';

import { Cron } from '@nestjs/schedule';

@Injectable()
export class GamesService {
  public id_game: number;

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
    const update_word = await this.prisma.game.update({
      where: { id: +id },
      data: { word: generate_word[0].word, games: game.games + 1, attempts: 0 },
    });
    return update_word;
  }

  // tarea programada que se ejecuta cada 5 minutos
  @Cron('*/5 * * * *')
  async getNewWordCron() {
    console.log('¡Tarea programada realizada 😬!');
    return await this.updateFindWord(this.id_game);
  }

  // Comparar palabra del usuario con palabra de la bd
  async compareWord(updateGameDto: UpdateGameDto) {
    const game = await this.getGame(updateGameDto.id);
    updateGameDto.games = game.games + 1;
    updateGameDto.attempts = game.attempts + 1;
    const { id, ...data } = updateGameDto;
    // agregar las partidas jugadas
    const find_word = await this.prisma.game.update({
      where: { id: +updateGameDto.id },
      data: data,
    });
    return find_word;
  }

  // async foundWord(word: string, list: Array<string>) {
  //   let left: number = 0;
  //   let right: number = list.length - 1;
  //   let position: number = -1;
  //   let found: boolean = false;
  //   let middle: any;
  //   while (found === false && left <= right) {
  //     middle = Math.floor((left + right) / 2);
  //     if (list[middle] == word) {
  //       console.log('en medio');
  //       found = true;
  //       position = middle;
  //     } else if (list[middle] > word) {
  //       console.log('derecha');
  //       right = middle - 1;
  //     } else {
  //       console.log('izquierda');
  //       left = middle + 1;
  //     }
  //   }

  //   for (const item of ) {
  //     await this.rightChar()
  //   }

  //   console.log(position, 'POSICION');
  //   return position;
  // }

  // async rightChar(position: number, character: string) {
  //   const positions: Array<number> = [];
  //   const chars: Array<string> = [];
  //   positions.push(position);
  //   chars.push(character);
  //   return [positions, chars];
  // }

  // obtener estadisticas
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
}
