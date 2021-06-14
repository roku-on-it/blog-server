import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Category } from 'src/module/category/model/category';
import { CreateCategory } from 'src/module/category/input/create-category';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { DeleteCategory } from 'src/module/category/input/delete-category';
import { UpdateCategory } from 'src/module/category/input/update-category';
import { Post } from 'src/module/post/model/post';
import { ListPost } from 'src/module/post/input/list-post';
import { ListCategory } from 'src/module/category/input/list-category';
import { Payload } from 'src/module/shared/decorator/param/payload';
import { Id } from 'src/module/shared/decorator/param/id';
import { Authorize } from 'src/module/auth/decorator/authorize';
import { UserRole } from 'src/module/user/model/enum/user-role';

@Resolver(() => Category)
export class CategoryResolver {
  @Query(() => Post)
  async category(@Id() id: number): Promise<Category> {
    return await Category.findOneOrFail({
      where: { id },
      loadRelationIds: true,
    });
  }

  @Query(() => [Category])
  async categories(
    @Args('filter', { nullable: true }) filter: ListCategory,
  ): Promise<Category[]> {
    return await filter.find();
  }

  @Mutation(() => Category)
  // @Authorize(UserRole.Admin)
  async createCategory(@Payload() payload: CreateCategory): Promise<Category> {
    return plainToClass(Category, payload).save();
  }

  @Mutation(() => Category)
  @Authorize(UserRole.Admin)
  async deleteCategory(@Payload() payload: DeleteCategory): Promise<Category> {
    const category = await Category.findOne(payload.id);
    return category.softRemove();
  }

  @Mutation(() => Category)
  @Authorize(UserRole.Mod)
  async updateCategory(@Payload() payload: UpdateCategory): Promise<Category> {
    const category = await Category.findOne(payload.id);
    return plainToClassFromExist(category, payload).save();
  }

  @ResolveField(() => [Post])
  async posts(
    @Parent() category: Category,
    @Args('filter', { nullable: true }) filter: ListPost,
  ): Promise<Post[]> {
    return filter.find({
      where: { category },
      loadRelationIds: true,
    });
  }
}
