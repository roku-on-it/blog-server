import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  SaveOptions,
  UpdateDateColumn,
} from 'typeorm';
import { GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { FilterableField, IDField } from '@nestjs-query/query-graphql';
import { UserInputError } from 'apollo-server-express';

@ObjectType()
export class Substructure extends BaseEntity {
  @IDField(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @FilterableField(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;

  @FilterableField(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt: Date;

  @FilterableField(() => GraphQLISODateTime, { nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;

  save(options?: SaveOptions): Promise<this> {
    return super.save(options).catch((error) => {
      if ('ER_DUP_ENTRY' === error.code) {
        throw new UserInputError('Duplicate');
      }

      return this;
    });
  }
}
