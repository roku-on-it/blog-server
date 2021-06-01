import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { IsPassword } from 'src/module/shared/decorator/is-password';

@InputType()
export class CreateUser {
  @Field()
  @Length(3, 32)
  username: string;

  @Field()
  @Length(3, 60)
  fullName: string;

  @Field()
  @IsPassword()
  password: string;
}
