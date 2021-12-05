import { Field, InputType } from '@nestjs/graphql';
import { FindManyOptions, ILike } from 'typeorm';
import { User } from 'src/module/user/model/user';
import { UserList } from 'src/module/user/model/user-list';

@InputType()
export class ListUser {
  @Field(() => String, { nullable: true })
  query = '';

  @Field({ nullable: true })
  pageIndex: number;

  @Field({ nullable: true })
  pageSize: number;

  async find(options?: FindManyOptions): Promise<UserList> {
    this.query = this.query.length > 2 ? this.query : '';

    const [items, total] = await User.findAndCount({
      skip: this.pageIndex * this.pageSize,
      take: this.pageSize ?? 5,
      where: [
        { username: ILike('%' + this.query + '%') },
        { fullName: ILike('%' + this.query + '%') },
      ],
      loadRelationIds: true,
      ...options,
    });

    return {
      items,
      total,
    };
  }
}
