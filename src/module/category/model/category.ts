import { Substructure } from 'src/module/shared/model/substructure';
import { Column, Entity, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/module/post/model/post';

@ObjectType()
@Entity()
export class Category extends Substructure {
  @Field()
  @Column()
  name: string;

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (p) => p.category)
  posts: Post[];
}
