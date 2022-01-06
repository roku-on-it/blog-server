import { Field, InputType } from '@nestjs/graphql';
import { FindManyOptions, ILike } from 'typeorm';
import { Category } from 'src/module/category/model/category';

@InputType()
export class ListCategory {
  @Field(() => String, { nullable: true })
  query = '';

  async find(options?: FindManyOptions): Promise<Category[]> {
    this.query = this.query.length > 2 ? this.query : '';

    return Category.find({
      loadRelationIds: true,
      where: {
        name: ILike('%' + this.query + '%'),
      },
      ...options,
    });
  }
}
