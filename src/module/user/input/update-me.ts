import { UpdateUser } from 'src/module/user/input/update-user';
import { UserRole } from 'src/module/user/model/enum/user-role';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, Length } from 'class-validator';
import { IsUsername } from 'src/module/shared/decorator/validator/is-username';
import { Trim } from 'src/module/shared/decorator/transform/trim';

type UpdateSelf = Omit<UpdateUser, 'id'>;

@InputType()
export class UpdateMe implements UpdateSelf {
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
