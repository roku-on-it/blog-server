import { Field, ID, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';

@InputType()
export class RefInput {
  @Field(() => ID)
  @Transform(({ value }) => parseInt(value))
  id: number;

  // noinspection JSUnusedLocalSymbols
  private constructor() {
    return;
  }
}
