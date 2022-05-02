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
}
