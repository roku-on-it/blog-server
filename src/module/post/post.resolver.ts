import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Post } from 'src/module/post/model/post';
import { NotFoundException } from '@nestjs/common';
import { Category } from 'src/module/category/model/category';
import { CreatePost } from 'src/module/post/input/create-post';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { DeletePost } from 'src/module/post/input/delete-post';
import { UpdatePost } from 'src/module/post/input/update-post';
import { ListPost } from 'src/module/post/input/list-post';

@Resolver(() => Post)
export class PostResolver {
  @Query(() => Post)
  async post(@Args('id') id: number): Promise<Post> {
    const post = await Post.findOne(id);
    if (null == post) {
      throw new NotFoundException();
    }

    return post;
  }

  @Query(() => [Post])
  async posts(
    @Args('filter', { nullable: true }) filter: ListPost,
  ): Promise<Post[]> {
    return await filter.find();
  }

  @Mutation(() => Post)
  async createPost(@Args('payload') payload: CreatePost): Promise<Post> {
    return plainToClass(Post, payload).save();
  }

  @Mutation(() => Post)
  async deletePost(@Args('payload') payload: DeletePost): Promise<Post> {
    const post = await Post.findOne(payload.id);
    if (null == post) {
      throw new NotFoundException();
    }

    return post.softRemove();
  }

  @Mutation(() => Post)
  async updatePost(@Args('payload') payload: UpdatePost): Promise<Post> {
    const post = await Post.findOne(payload.id);
    if (null == post) {
      throw new NotFoundException();
    }

    return plainToClassFromExist(post, payload).save();
  }

  @ResolveField(() => Category)
  async category(@Parent() post: Post): Promise<Category> {
    const category = await Category.findOne(post.category);

    if (null == category) {
      throw new NotFoundException();
    }

    return category;
  }
}
