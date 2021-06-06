import { Field, ID, InputType } from '@nestjs/graphql';

// Two models of created for Delete and Update operations in order to
// see which class instance is causing in case of a problem.

@InputType()
export abstract class UpdateModel {
  @Field(() => ID)
  id: string;
}
