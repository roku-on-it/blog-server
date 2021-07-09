import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from 'src/module/user/model/enum/user-role';
import { User } from 'src/module/user/model/user';
import { Session } from 'src/module/auth/guard/interface/gql-context';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const role = this.reflector.get<UserRole>('role', context.getHandler());
    const session: Session =
      GqlExecutionContext.create(context).getContext().req.session;

    if (null == role) {
      return null != session.userId;
    }

    if (null == session.userId) {
      return false;
    }

    const user = await User.createQueryBuilder('user')
      .select('user.role')
      .where('user.id = :id', { id: session.userId })
      .getOne();

    if (null == user) {
      throw new NotFoundException();
    }

    return user.role >= role;
  }
}
