import { Field, InputType } from '@nestjs/graphql';
import { Post } from 'src/module/post/model/post';
import { FindManyOptions, ILike } from 'typeorm';
import { Substructure } from 'src/module/shared/model/substructure';
import { PostList } from 'src/module/post/model/post-list';
import { OrderBy } from 'src/module/shared/input/order-by';
import { isFieldsValid } from 'src/module/helper/isFieldsValid';
import { Filterable } from 'src/types';

const validFields: Filterable<Post, string | number>[] = ['title'];

@InputType()
export class ListPost {
  @Field(() => String, { nullable: true })
  query = '';

  @Field({ nullable: true })
  orderBy: OrderBy<Post>;

  @Field({ nullable: true })
  pageIndex: number;

  @Field({ nullable: true })
  pageSize: number;

  async find(
    options?: FindManyOptions,
    relation?: Substructure,
  ): Promise<PostList> {
    isFieldsValid<Post>(this.orderBy, validFields);
    this.query = this.query.length > 2 ? this.query : '';

    if (relation) {
      return {
        items: await Post.find({
          order: {
            [this.orderBy?.field ?? 'createdAt']:
              this.orderBy?.direction ?? 'ASC',
          },
          skip: this.pageIndex * this.pageSize,
          take: this.pageSize ?? 5,
          where: [
            {
              [relation.constructor.name.toLocaleLowerCase()]: relation,
              title: ILike('%' + this.query + '%'),
            },
            {
              [relation.constructor.name.toLocaleLowerCase()]: relation,
              content: ILike('%' + this.query + '%'),
            },
          ],
          loadRelationIds: true,
          ...options,
        }),
        total: await Post.count(),
      };
    }

    return {
      items: await Post.find({
        order: {
          [this.orderBy?.field ?? 'createdAt']:
            this.orderBy?.direction ?? 'ASC',
        },
        skip: this.pageIndex * this.pageSize,
        take: this.pageSize ?? 5,
        where: [
          { title: ILike('%' + this.query + '%') },
          { content: ILike('%' + this.query + '%') },
        ],
        loadRelationIds: true,
        ...options,
      }),
      total: await Post.count(),
    };
  }
}
