import { Field, ObjectType } from '@nestjs/graphql';
import { Substructure } from 'src/module/shared/model/substructure';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { Post } from 'src/module/post/model/post';
import { UserRole } from 'src/module/user/model/enum/user-role';
import { hash } from 'bcrypt';

@ObjectType()
@Entity()
export class User extends Substructure {
  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  fullName: string;

  @Column()
  password: string;

  @Field(() => UserRole)
  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (p) => p.user, { nullable: true })
  posts: Post[];

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    this.password = await hash(this.password, 14);
  }
}