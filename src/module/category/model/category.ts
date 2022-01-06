import { Substructure } from 'src/module/shared/model/substructure';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/module/post/model/post';
import { slugify } from 'src/module/helper/slugify';
import { PostList } from 'src/module/post/model/post-list';

@ObjectType()
@Entity()
export class Category extends Substructure {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  slug: string;

  @Field(() => PostList, { nullable: true })
  @OneToMany(() => Post, (p) => p.category)
  posts: Post[];

  @BeforeInsert()
  @BeforeUpdate()
  private async beforeWrite() {
    this.slug = await slugify(this.name);
  }
}
