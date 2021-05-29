import { Substructure } from 'src/module/shared/model/substructure';
import { Column, Entity, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/module/post/model/post';
import { LanguageType } from 'src/module/shared/model/enum/language-type.enum';

@ObjectType()
@Entity()
export class Category extends Substructure {
  @Field()
  @Column()
  name: string;

  @Field(() => LanguageType)
  @Column({ type: 'enum', enum: LanguageType })
  language: LanguageType;

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (p) => p.category, { nullable: true })
  posts: Post[];
}
