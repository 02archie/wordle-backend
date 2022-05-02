import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/services/prisma.service';
import { users } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // obtener usuario por email
  async findUserByEmail(email: string): Promise<users | null> {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }
}
