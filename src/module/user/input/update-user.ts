import { UpdateModel } from 'src/module/shared/input/update-model';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, Length } from 'class-validator';
import { Trim } from 'src/module/shared/decorator/trim';
import { UserRole } from 'src/module/user/model/enum/user-role';

@InputType()
export class UpdateUser extends UpdateModel {
  @Field({ nullable: true })
  @IsOptional()
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
