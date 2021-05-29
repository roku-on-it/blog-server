import { Field, InputType } from '@nestjs/graphql';
import { UpdateModel } from 'src/module/shared/input/update-model';
import { Category } from 'src/module/category/model/category';
import { IsArray, IsOptional } from 'class-validator';
import { RefInput } from 'src/module/shared/input/ref-input';

@InputType()
export class UpdatePost extends UpdateModel {
  @Field({ nullable: true })
  @IsOptional()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  content: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  sources: string[];

  @Field(() => RefInput, { nullable: true })
  @IsOptional()
  category: Category;
}
