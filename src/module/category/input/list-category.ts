import { Field, InputType } from '@nestjs/graphql';
import { FindManyOptions, ILike } from 'typeorm';
import { Category } from 'src/module/category/model/category';

@InputType()
export class ListCategory {
  @Field({ nullable: true })
  query: string;

  async find(options?: FindManyOptions): Promise<Category[]> {
    if (null != this.query && this.query?.length) {
      return Category.find({
        loadRelationIds: true,
        where: {
          name: ILike('%' + this.query + '%'),
        },
        ...options,
      });
    }

    return Category.find({ loadRelationIds: true, ...options });
  }
}
