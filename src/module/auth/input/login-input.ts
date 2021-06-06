import { Field, InputType } from '@nestjs/graphql';
import { IsPassword } from 'src/module/shared/decorator/validator/is-password';

@InputType()
export class LoginInput {
  @Field()
  username: string;

  @Field()
  @IsPassword()
  password: string;
}
