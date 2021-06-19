import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { User } from 'src/module/user/model/user';
import { GQLContext } from 'src/module/auth/guard/interface/gql-context';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

export const roleCheck: FieldMiddleware = async (
  { info, context }: MiddlewareContext,
  next: NextFn,
) => {
  const {
    extensions: { role },
  } = info.parentType.getFields()[info.fieldName];
  const session = (context as GQLContext).req.session;

  if (null == session.userId) {
    throw new UnauthorizedException(
      'Must be logged in to access ' + info.fieldName,
    );
  }

  const user = await User.createQueryBuilder('user')
    .select('user.role')
    .where('user.id = :id', { id: session.userId })
    .getOne();

  if (user.role < role) {
    throw new ForbiddenException(
      'Insufficient permission to access ' + info.fieldName,
    );
  }

  return next();
};
