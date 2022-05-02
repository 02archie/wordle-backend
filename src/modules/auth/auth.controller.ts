import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { AppController } from '../../app.controller';

@Controller('auth')
export class AuthController extends AppController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  // Iniciar sesión
  @Post('login')
  async login(@Body() req: LoginDto, @Res() res: Response) {
    try {
      const validation = await this.authService.validateUser(
        req.email.toString(),
        req.password.toString(),
      );
      const response = await this.authService.generateJWT(validation);
      return res.status(HttpStatus.OK).json({
        response,
      });
    } catch (error) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }
  }
}
