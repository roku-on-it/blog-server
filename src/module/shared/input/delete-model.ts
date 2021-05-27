import { ID, InputType } from '@nestjs/graphql';
import { IDField } from '@nestjs-query/query-graphql';

// Two models of created for Delete and Update operations in order to
// see which class instance is causing in case of a problem.

@InputType()
export abstract class DeleteModel {
  @IDField(() => ID)
  id: string;
}
