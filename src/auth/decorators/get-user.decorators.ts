import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Prisma, User } from '../../../generated/prisma';
import { Request } from 'express';

export const GetUser = createParamDecorator<Prisma.UserScalarFieldEnum>(
  (data: Prisma.UserScalarFieldEnum, ctx: ExecutionContext) => {
    const request: Request & { user: User } = ctx.switchToHttp().getRequest();

    if (data) return request.user[data];

    return request.user;
  },
);
