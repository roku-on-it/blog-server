import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { IsPassword } from 'src/module/shared/decorator/is-password';
import { Match } from 'src/module/shared/decorator/match';

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

  @Field()
  @IsPassword()
  @Match('password')
  confirmPassword: string;
}
