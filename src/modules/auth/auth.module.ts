import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';

import { AuthController } from './auth.controller';

import { jwtConstants } from './constants';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [],
      useFactory: () => {
        return {
          secret: jwtConstants.secret,
          signOptions: {
            expiresIn: '8h',
          },
        };
      },
    }),
    UsersModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
