import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/module/user/model/user';
import { GQLContext } from 'src/module/auth/guard/interface/gql-context';

export const CurrentUser = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const ctx: GQLContext = GqlExecutionContext.create(context).getContext();
    const id = ctx.req.session.userId;

    return User.findOneOrFail({ id });
  },
);
