import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../../../generated/prisma';

export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request & { user: User } = context
      .switchToHttp()
      .getRequest();

    console.log(request.user);

    return request.user.role === 'admin';
  }
}
