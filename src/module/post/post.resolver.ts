import {
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Post } from 'src/module/post/model/post';
import { Category } from 'src/module/category/model/category';
import { CreatePost } from 'src/module/post/input/create-post';
import { plainToClass } from 'class-transformer';
import { DeletePost } from 'src/module/post/input/delete-post';
import { UpdatePost } from 'src/module/post/input/update-post';
import { ListPost } from 'src/module/post/input/list-post';
import { Payload } from 'src/module/shared/decorator/param/payload';
import { Id } from 'src/module/shared/decorator/param/id';
import { Authorize } from 'src/module/auth/decorator/authorize';
import { UserRole } from 'src/module/user/model/enum/user-role';
import { User } from 'src/module/user/model/user';
import { CurrentUser } from 'src/module/shared/decorator/param/current-user';
import { RateLimit } from 'src/module/auth/decorator/rate-limit';
import { Filter } from 'src/module/shared/decorator/param/filter';

@Resolver(() => Post)
export class PostResolver {
  @Query(() => Post)
  async post(@Id() id: number): Promise<Post> {
    return Post.findOneOrFail({ loadRelationIds: true, where: { id } });
  }

  @Query(() => [Post])
  async posts(@Filter() filter: ListPost): Promise<Post[]> {
    return filter.find();
  }

  @Mutation(() => Post)
  @Authorize(UserRole.Admin)
  @RateLimit(1, 30)
  async createPost(
    @Payload() payload: CreatePost,
    @CurrentUser() user: User,
  ): Promise<Post> {
    return plainToClass(Post, { ...payload, user }).save();
  }

  @Mutation(() => Post)
  @Authorize(UserRole.Admin)
  @RateLimit(1, 30)
  async deletePost(@Payload() payload: DeletePost): Promise<Post> {
    const post = await Post.findOneOrFail(payload.id);
    return post.softRemove();
  }

  @Mutation(() => Post)
  @Authorize(UserRole.Mod)
  @RateLimit(2, 10)
  async updatePost(@Payload() payload: UpdatePost): Promise<Post> {
    return Post.findOneAndUpdate(payload);
  }

  @ResolveField(() => Category)
  async category(@Parent() post: Post): Promise<Category> {
    return Category.findOne(post.category, { loadRelationIds: true });
  }

  @ResolveField(() => User)
  async user(@Parent() post: Post): Promise<User> {
    return User.findOneOrFail(post.user, {
      loadRelationIds: true,
    });
  }
}
