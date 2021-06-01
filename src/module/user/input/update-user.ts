import { UpdateModel } from 'src/module/shared/input/update-model';
import { Field } from '@nestjs/graphql';
import { IsOptional, Length } from 'class-validator';
import { IsPassword } from 'src/module/shared/decorator/is-password';

export class UpdateUser extends UpdateModel {
  @Field({ nullable: true })
  @IsOptional()
  @Length(3, 32)
  username: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(3, 60)
  fullName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsPassword()
  password: string;
}
