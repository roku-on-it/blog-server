import { UpdateModel } from 'src/module/shared/input/update-model';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Trim } from 'src/module/decorator/trim';

@InputType()
export class UpdateCategory extends UpdateModel {
  @Field({ nullable: true })
  @IsOptional()
  @Trim()
  name: string;
}
