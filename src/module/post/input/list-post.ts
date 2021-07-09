import { Field, InputType } from '@nestjs/graphql';
import { Post } from 'src/module/post/model/post';
import { FindManyOptions, ILike } from 'typeorm';

@InputType()
export class ListPost {
  @Field({ nullable: true })
  query: string;

  @Field({ nullable: true })
  pageIndex: number;

  @Field({ nullable: true })
  pageSize: number;

  async find(options?: FindManyOptions): Promise<Post[]> {
    if (null != this.query && this.query?.length) {
      return Post.find({
        skip: this.pageIndex * this.pageSize,
        take: this.pageSize,
        where: [
          { title: ILike('%' + this.query + '%') },
          { content: ILike('%' + this.query + '%') },
        ],
        loadRelationIds: true,
        ...options,
      });
    }

    return Post.find({
      skip: this.pageIndex * this.pageSize,
      take: this.pageSize,
      loadRelationIds: true,
      ...options,
    });
  }
}
