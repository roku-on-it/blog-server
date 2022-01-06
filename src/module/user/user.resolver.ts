import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from 'src/module/user/model/user';
import { CurrentUser } from 'src/module/shared/decorator/param/current-user';
import { UpdateUser } from 'src/module/user/input/update-user';
import { ListUser } from 'src/module/user/input/list-user';
import { DeleteUser } from 'src/module/user/input/delete-user';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { UpdateUserPassword } from 'src/module/user/input/update-user-password';
import { plainToClassFromExist } from 'class-transformer';
import { AuthService } from 'src/module/auth/service/auth.service';
import { hash } from 'bcrypt';
import { Payload } from 'src/module/shared/decorator/param/payload';
import { Id } from 'src/module/shared/decorator/param/id';
import { UpdateMe } from 'src/module/user/input/update-me';
import { RateLimit } from 'src/module/auth/decorator/rate-limit';
import { GQLContext } from 'src/module/auth/guard/interface/gql-context';
import { ListPost } from 'src/module/post/input/list-post';
import { PostList } from 'src/module/post/model/post-list';
import { UserList } from 'src/module/user/model/user-list';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => User)
  // @Authorize(UserRole.Mod)
  async user(@Id() id: bigint): Promise<User> {
    return User.findOneOrFail({ id });
  }

  @Query(() => UserList)
  // @Authorize(UserRole.Mod)
  async users(
    @Args('filter', { nullable: true }) filter: ListUser,
  ): Promise<UserList> {
    return filter.find();
  }

  @Mutation(() => User)
  // @Authorize(UserRole.Admin)
  @RateLimit(10, 20)
  async updateUser(
    @CurrentUser() currentUser: User,
    @Payload() payload: UpdateUser,
  ): Promise<User> {
    const user = await User.findOneOrFail(payload.id);

    if (currentUser.role <= user.role) {
      throw new ForbiddenException('Insufficient permission');
    }

    if (currentUser.role <= payload.role) {
      throw new ForbiddenException('Insufficient permission');
    }

    return User.findOneAndUpdate(payload);
  }

  @Mutation(() => User)
  // @Authorize(UserRole.Admin)
  @RateLimit(2, 10)
  async deleteUser(
    @CurrentUser() currentUser: User,
    @Payload() payload: DeleteUser,
  ): Promise<User> {
    const user = await User.findOneOrFail(payload.id);

    if (currentUser.role <= user.role) {
      throw new ForbiddenException('Insufficient permission');
    }

    return user.softRemove();
  }

  @ResolveField(() => PostList)
  async posts(
    @Parent() user: User,
    @Payload('filter', true) filter: ListPost,
  ): Promise<PostList> {
    return filter.find(
      {
        loadRelationIds: true,
      },
      user,
    );
  }

  // User's query & mutations

  @Query(() => User)
  // @Authorize()
  async me(@CurrentUser() currentUser: User): Promise<User> {
    return currentUser;
  }

  @Mutation(() => User)
  // @Authorize()
  @RateLimit(2, 10)
  async updateMyPassword(
    @CurrentUser() currentUser: User,
    @Payload() payload: UpdateUserPassword,
  ): Promise<User> {
    const passMatch = await this.authService.comparePasswords(
      payload.password,
      currentUser.password,
    );

    if (!passMatch) {
      throw new UnauthorizedException();
    }

    const newPassword = await hash(payload.newPassword, 12);
    await plainToClassFromExist(currentUser, {
      password: newPassword,
    }).save();
    return currentUser;
  }

  @Mutation(() => User)
  // @Authorize()
  async deleteMe(
    @CurrentUser() currentUser: User,
    @Context() context: GQLContext,
  ): Promise<User> {
    await this.authService.logoutAndDestroySession(context);
    return currentUser.softRemove();
  }

  @Mutation(() => User)
  // @Authorize()
  @RateLimit(3, 60)
  async updateMe(
    @CurrentUser() currentUser: User,
    @Payload() payload: UpdateMe,
  ): Promise<User> {
    return plainToClassFromExist(currentUser, payload).save();
  }
}
