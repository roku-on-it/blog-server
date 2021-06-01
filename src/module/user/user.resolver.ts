import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/module/user/model/user';
import { CurrentUser } from 'src/module/shared/decorator/current-user';
import { Authorize } from 'src/module/auth/decorator/authorize';

@Resolver(() => User)
export class UserResolver {
  @Query(() => User)
  async user(@Args('id') id: number): Promise<User> {
    return await User.findOne(id);
  }

  @Query(() => User)
  @Authorize()
  async currentUser(@CurrentUser() user: User): Promise<User> {
    console.log(user);
    return user;
  }
}
