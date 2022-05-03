import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class WordsService {
  constructor(private readonly prisma: PrismaService) {}

  // obtener una palabra aleatoria de la base de datos max_length = 5
  async getOneWord() {
    const word = await this.prisma.$queryRaw`SELECT w.id, w.word 
    FROM words as w
    GROUP BY w.id
    HAVING MAX(LENGTH(w.word)) = 5
    ORDER BY random()
    LIMIT 1`;
    return word;
  }

  // aumentar contador que dice que tantas veces han adivinado una palabra
  async countFound(word: string) {
    const word_found = await this.prisma.words.findUnique({
      where: { word: word },
    });
    const word_update = await this.prisma.words.update({
      where: { word: word },
      data: { found: word_found.found + 1 },
    });
    return word_update;
  }

  // Obtener las palabras más encontradas
  async getWordsMoreFound() {
    const words = await this.prisma.words.findMany({
      where: { deleted_at: null },
      orderBy: [{ found: 'desc' }],
      take: 5,
    });
    return words;
  }
}
