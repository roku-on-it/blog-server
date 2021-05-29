import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Substructure } from 'src/module/shared/model/substructure';
import { Category } from 'src/module/category/model/category';

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

  @Field(() => Category)
  @ManyToOne(() => Category, (c) => c.posts)
  category: Category;
}
