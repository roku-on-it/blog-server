import { Field, InputType } from '@nestjs/graphql';
import { Post } from 'src/module/post/model/post';
import { FindManyOptions, ILike } from 'typeorm';

@InputType()
export class ListPost {
  @Field({ nullable: true })
  query: string;

  async find(options?: FindManyOptions): Promise<Post[]> {
    if (null != this.query && this.query?.length) {
      return Post.find({
        where: [
          { title: ILike('%' + this.query + '%') },
          { content: ILike('%' + this.query + '%') },
        ],
        loadRelationIds: true,
        ...options,
      });
    }
    return Post.find({ loadRelationIds: true, ...options });
  }
}
