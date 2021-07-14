import { Field, InputType } from '@nestjs/graphql';
import { Direction } from 'src/module/shared/enum/direction';
import { BaseTypes, Filterable } from 'src/types';

@InputType()
export class OrderBy<T> {
  @Field(() => String)
  field: Filterable<T, BaseTypes>;

  @Field(() => Direction)
  direction: Direction;
}
