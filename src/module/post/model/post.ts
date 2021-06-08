import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Substructure } from 'src/module/shared/model/substructure';
import { Category } from 'src/module/category/model/category';
import { User } from 'src/module/user/model/user';

@ObjectType()
@Entity()
export class Post extends Substructure {
  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  content: string;

  @Field(() => [String], { nullable: true })
  @Column({ type: 'simple-array', nullable: true })
  sources: string[];

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (c) => c.posts, { nullable: true })
  category: Category;

  @Field(() => User)
  @ManyToOne(() => User, (u) => u.posts)
  user: User;
}
