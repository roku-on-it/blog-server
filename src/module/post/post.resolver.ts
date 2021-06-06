import {
  Args,
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
import { NotFoundException } from '@nestjs/common';
import { Payload } from 'src/module/shared/decorator/param/payload';
import { Id } from 'src/module/shared/decorator/param/id';

@Resolver(() => Post)
export class PostResolver {
  @Query(() => Post)
  async post(@Id() id: number): Promise<Post> {
    return await Post.findOneOrFail({ id });
  }

  @Query(() => [Post])
  async posts(
    @Args('filter', { nullable: true }) filter: ListPost,
  ): Promise<Post[]> {
    return await filter.find();
  }

  @Mutation(() => Post)
  async createPost(@Payload() payload: CreatePost): Promise<Post> {
    return plainToClass(Post, payload).save();
  }

  @Mutation(() => Post)
  async deletePost(@Payload() payload: DeletePost): Promise<Post> {
    const post = await Post.findOneOrFail(payload.id);
    return post.softRemove();
  }

  @Mutation(() => Post)
  async updatePost(@Payload() payload: UpdatePost): Promise<Post> {
    return await Post.findOneAndUpdate(payload);
  }

  @ResolveField(() => Category)
  async category(@Parent() post: Post): Promise<Category> {
    const category = await Category.findOne(post.category);

    if (null == category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}
