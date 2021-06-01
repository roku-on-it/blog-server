import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class JwtResponse {
  @Field()
  token: string;
}
