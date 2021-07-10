import { Field, InputType } from '@nestjs/graphql';
import { FindManyOptions, ILike } from 'typeorm';
import { User } from 'src/module/user/model/user';

@InputType()
export class ListUser {
  @Field(() => String, { nullable: true })
  query = '';

  async find(options?: FindManyOptions): Promise<User[]> {
    this.query = this.query.length > 2 ? this.query : '';

    return User.find({
      where: [
        { fullName: ILike('%' + this.query + '%') },
        { username: ILike('%' + this.query + '%') },
      ],
      ...options,
    });
  }
}
