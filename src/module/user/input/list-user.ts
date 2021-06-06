import { Field, InputType } from '@nestjs/graphql';
import { FindManyOptions, ILike } from 'typeorm';
import { User } from 'src/module/user/model/user';

@InputType()
export class ListUser {
  @Field({ nullable: true })
  query: string;

  async find(options?: FindManyOptions): Promise<User[]> {
    if (null != this.query && this.query?.length) {
      return User.find({
        where: [
          { fullName: ILike('%' + this.query + '%') },
          { username: ILike('%' + this.query + '%') },
        ],
      });
    }
    return User.find(options);
  }
}
