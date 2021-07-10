import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/module/post/model/post';

@ObjectType()
export class PostList {
  @Field(() => [Post])
  items: Post[];

  @Field()
  total: number;
}
