import { Injectable } from '@nestjs/common';

import { UsersService } from 'src/modules/users/users.service';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService,) {}

  // validar si el usuario existe, buscandolo por email
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password.toString());
      if (isMatch) {
        const { password, ...res } = user;
        return res;
      }
    }
    return null;
  }

  // generar json web token
  async generateJWT(user: any) {
    const payload = await { email: user.email, sub: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
