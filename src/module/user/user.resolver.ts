import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from 'src/module/user/model/user';
import { CurrentUser } from 'src/module/shared/decorator/param/current-user';
import { UpdateUser } from 'src/module/user/input/update-user';
import { Authorize } from 'src/module/auth/decorator/authorize';
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
import { UserRole } from 'src/module/user/model/enum/user-role';
import { Post } from 'src/module/post/model/post';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => User)
  @Authorize(UserRole.Mod)
  async user(@Id() id: number): Promise<User> {
    return await User.findOneOrFail({ id });
  }

  @Query(() => [User])
  @Authorize(UserRole.Mod)
  async users(
    @Args('filter', { nullable: true }) filter: ListUser,
  ): Promise<User[]> {
    return await filter.find();
  }

  @Mutation(() => User)
  @Authorize(UserRole.Mod)
  async updateUser(@Payload() payload: UpdateUser): Promise<User> {
    return await User.findOneAndUpdate(payload);
  }

  @Mutation(() => User)
  @Authorize(UserRole.Admin)
  async deleteUser(
    @Payload() payload: DeleteUser,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    const user = await User.findOneOrFail(payload.id);

    if (currentUser.role <= user.role) {
      throw new ForbiddenException();
    }

    return user.softRemove();
  }

  @ResolveField(() => [Post])
  async posts(@Parent() user: User): Promise<Post[]> {
    return Post.find({
      where: { user },
      loadRelationIds: true,
    });
  }

  // User's query & mutations

  @Query(() => User)
  @Authorize()
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @Mutation(() => User)
  @Authorize()
  async updateMyPassword(
    @CurrentUser() user: User,
    @Payload() payload: UpdateUserPassword,
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

  @Mutation(() => User)
  @Authorize()
  async deleteMe(@CurrentUser() user: User): Promise<User> {
    return await user.softRemove();
  }

  @Mutation(() => User)
  @Authorize()
  async updateMe(
    @CurrentUser() user: User,
    @Payload() payload: UpdateMe,
  ): Promise<User> {
    return plainToClassFromExist(user, payload).save();
  }
}
