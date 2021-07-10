import { Field, InputType } from '@nestjs/graphql';
import { Post } from 'src/module/post/model/post';
import { FindManyOptions, ILike } from 'typeorm';

@InputType()
export class ListPost {
  @Field(() => String, { nullable: true })
  query = '';

  @Field({ nullable: true })
  pageIndex: number;

  @Field({ nullable: true })
  pageSize: number;

  async find(options?: FindManyOptions): Promise<Post[]> {
    this.query = this.query.length > 2 ? this.query : '';

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
