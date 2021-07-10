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
import { ListPost } from 'src/module/post/input/list-post';
import { ListCategory } from 'src/module/category/input/list-category';
import { Payload } from 'src/module/shared/decorator/param/payload';
import { Id } from 'src/module/shared/decorator/param/id';
import { Authorize } from 'src/module/auth/decorator/authorize';
import { UserRole } from 'src/module/user/model/enum/user-role';
import { RateLimit } from 'src/module/auth/decorator/rate-limit';
import { Filter } from 'src/module/shared/decorator/param/filter';
import { PostList } from 'src/module/post/model/post-list';

@Resolver(() => Category)
export class CategoryResolver {
  @Query(() => Category)
  async category(@Id() id: number): Promise<Category> {
    return Category.findOneOrFail({
      where: { id },
      loadRelationIds: true,
    });
  }

  @Query(() => [Category])
  async categories(
    @Args('filter', { nullable: true }) filter: ListCategory,
  ): Promise<Category[]> {
    return filter.find();
  }

  @Mutation(() => Category)
  @Authorize(UserRole.Admin)
  @RateLimit(1, 30)
  async createCategory(@Payload() payload: CreateCategory): Promise<Category> {
    return plainToClass(Category, payload).save();
  }

  @Mutation(() => Category)
  @Authorize(UserRole.Admin)
  @RateLimit(1, 30)
  async deleteCategory(@Payload() payload: DeleteCategory): Promise<Category> {
    const category = await Category.findOne(payload.id);
    return category.softRemove();
  }

  @Mutation(() => Category)
  @Authorize(UserRole.Mod)
  @RateLimit(2, 10)
  async updateCategory(@Payload() payload: UpdateCategory): Promise<Category> {
    const category = await Category.findOne(payload.id);
    return plainToClassFromExist(category, payload).save();
  }

  @ResolveField(() => PostList)
  async posts(
    @Parent() category: Category,
    @Filter() filter: ListPost,
  ): Promise<PostList> {
    return filter.find(
      {
        loadRelationIds: true,
      },
      category,
    );
  }
}
