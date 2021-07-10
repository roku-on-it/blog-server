import { Field, InputType } from '@nestjs/graphql';
import { Post } from 'src/module/post/model/post';
import { FindManyOptions, ILike } from 'typeorm';
import { Substructure } from 'src/module/shared/model/substructure';

@InputType()
export class ListPost {
  @Field(() => String, { nullable: true })
  query = '';

  @Field({ nullable: true })
  pageIndex: number;

  @Field({ nullable: true })
  pageSize: number;

  async find(
    options?: FindManyOptions,
    relation?: Substructure,
  ): Promise<Post[]> {
    this.query = this.query.length > 2 ? this.query : '';

    if (relation) {
      return Post.find({
        skip: this.pageIndex * this.pageSize,
        take: this.pageSize ?? 5,
        where: [
          {
            category: relation,
            title: ILike('%' + this.query + '%'),
          },
          {
            category: relation,
            content: ILike('%' + this.query + '%'),
          },
        ],
        loadRelationIds: true,
        ...options,
      });
    }

    return Post.find({
      skip: this.pageIndex * this.pageSize,
      take: this.pageSize ?? 5,
      where: [
        { title: ILike('%' + this.query + '%') },
        { content: ILike('%' + this.query + '%') },
      ],
      loadRelationIds: true,
      ...options,
    });
  }
}
