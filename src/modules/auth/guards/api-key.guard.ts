import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "src/modules/auth/decorators/public.decorator";

@Injectable()
export class ApiKeyGuard implements CanActivate {

  constructor(
    private reflector: Reflector,
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if(isPublic){
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.header('token');
    const isAuth = authHeader === 'XuvX4!1&e0#W7HkvlC8Fo#3kcB!';
    if(!isAuth){
      throw new UnauthorizedException(`Necesitas iniciar sesión`);
    }
    return isAuth;
  }
}
