import { Substructure } from 'src/module/shared/model/substructure';
import { Column, Entity, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/module/post/model/post';
import { ProtectedField } from 'src/module/shared/decorator/property/protected-field';
import { UserRole } from 'src/module/user/model/enum/user-role';

@ObjectType()
@Entity()
export class Category extends Substructure {
  @ProtectedField(UserRole.Root, () => String)
  @Column()
  name: string;

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (p) => p.category)
  posts: Post[];
}
