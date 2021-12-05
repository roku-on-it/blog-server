import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/module/user/model/user';

@ObjectType()
export class UserList {
  @Field(() => [User])
  items: User[];

  @Field()
  total: number;
}
