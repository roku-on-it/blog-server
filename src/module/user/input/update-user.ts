import { UpdateModel } from 'src/module/shared/input/update-model';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, Length } from 'class-validator';
import { Trim } from 'src/module/shared/decorator/transform/trim';
import { UserRole } from 'src/module/user/model/enum/user-role';
import { IsUsername } from 'src/module/shared/decorator/validator/is-username';

@InputType()
export class UpdateUser extends UpdateModel {
  @Field({ nullable: true })
  @IsOptional()
  @IsUsername()
  @Trim()
  @Length(3, 32)
  username: string;

  @Field({ nullable: true })
  @IsOptional()
  @Trim()
  @Length(3, 60)
  fullName: string;

  @Field(() => UserRole, { nullable: true })
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}
