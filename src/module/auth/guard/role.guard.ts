import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/module/user/model/user';
import { UserRole } from 'src/module/user/model/enum/user-role';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const role = this.reflector.get<UserRole>('role', context.getHandler());
    const user: User = GqlExecutionContext.create(context).getContext().user;

    if (null == role) {
      return true;
    }

    return user.role >= role;
  }
}
