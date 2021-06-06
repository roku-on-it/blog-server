import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/module/user/model/user';
import { CurrentUser } from 'src/module/shared/decorator/current-user';
import { UpdateUser } from 'src/module/user/input/update-user';
import { Authorize } from 'src/module/auth/decorator/authorize';
import { ListUser } from 'src/module/user/input/list-user';
import { DeleteUser } from 'src/module/user/input/delete-user';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateUserPassword } from 'src/module/user/input/update-user-password';
import { plainToClassFromExist } from 'class-transformer';
import { AuthService } from 'src/module/auth/service/auth.service';
import { hash } from 'bcrypt';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => User)
  @Authorize()
  async user(@Args('id') id: number): Promise<User> {
    return await User.findOneOrFail({ id });
  }

  @Query(() => [User])
  async users(
    @Args('filter', { nullable: true }) filter: ListUser,
  ): Promise<User[]> {
    return await filter.find();
  }

  @Mutation(() => User)
  async updateUser(@Args('payload') payload: UpdateUser): Promise<User> {
    return await User.findOneAndUpdate(payload);
  }

  @Mutation(() => User)
  async deleteUser(@Args('payload') payload: DeleteUser): Promise<User> {
    const user = await User.findOneOrFail(payload.id);

    if (null == user) {
      throw new NotFoundException();
    }

    return user.softRemove();
  }

  // User's query & mutations

  @Query(() => User)
  @Authorize()
  async currentUser(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @Mutation(() => User)
  @Authorize()
  async updatePassword(
    @CurrentUser() user: User,
    @Args('payload') payload: UpdateUserPassword,
  ): Promise<User> {
    const passMatch = await this.authService.comparePasswords(
      payload.password,
      user.password,
    );

    if (!passMatch) {
      throw new UnauthorizedException();
    }

    const newPassword = await hash(payload.newPassword, 12);
    await plainToClassFromExist(user, {
      password: newPassword,
    }).save();
    return user;
  }
}
