import {
  BaseEntity,
  BeforeInsert,
  CreateDateColumn,
  DeleteDateColumn,
  EntityNotFoundError,
  FindConditions,
  FindOneOptions,
  ObjectID,
  ObjectType as ObjectType$,
  PrimaryColumn,
  SaveOptions,
  UpdateDateColumn,
} from 'typeorm';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { plainToClassFromExist } from 'class-transformer';
import { UpdateModel } from 'src/module/shared/input/update-model';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UniqueID } from 'nodejs-snowflake';

@ObjectType()
export class Substructure extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn({ type: 'bigint' })
  id: bigint;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;

  save(options?: SaveOptions): Promise<this> {
    return super.save(options).catch((error) => {
      if ('23505' === error?.code) {
        // 23505 is UniqueViolation for Postgres
        throw new ConflictException();
      }

      return this;
    });
  }

  static findOneOrFail<T extends BaseEntity>(
    this: ObjectType$<T>,
    id?: string | number | Date | ObjectID,
    options?: FindOneOptions<T>,
  ): Promise<T>;
  /**
   * Finds first entity that matches given options.
   */
  static findOneOrFail<T extends BaseEntity>(
    this: ObjectType$<T>,
    options?: FindOneOptions<T>,
  ): Promise<T>;
  /**
   * Finds first entity that matches given conditions.
   */
  static findOneOrFail<T extends BaseEntity>(
    this: ObjectType$<T>,
    conditions?: FindConditions<T>,
    options?: FindOneOptions<T>,
  ): Promise<T>;

  static findOneOrFail(...args) {
    if (args[0] instanceof Substructure) {
      args[0] = args[0].id;
    }

    return super.findOneOrFail(...args).catch((error) => {
      if (/22P02|22003/.test(error.code)) {
        throw new NotFoundException(this.name + ' not found');
      }

      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(this.name + ' not found');
      }

      throw error;
    });
  }

  static async findOneAndUpdate<T extends UpdateModel, U extends BaseEntity>({
    id,
    ...payload
  }: T) {
    const entity = await this.findOneOrFail(id);

    if (null == entity) {
      throw new NotFoundException(this.name + ' not found');
    }

    await plainToClassFromExist(entity, payload).save();

    return entity as unknown as U;
  }

  @BeforeInsert()
  private async generateSnowflake() {
    this.id = new UniqueID({
      customEpoch: 1609459200,
    }).getUniqueID() as bigint;
  }
}
