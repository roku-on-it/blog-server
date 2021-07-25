import { Field, InputType } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsObject,
  IsOptional,
  Length,
} from 'class-validator';
import { RefInput } from 'src/module/shared/input/ref-input';
import { Category } from 'src/module/category/model/category';
import { Trim } from 'src/module/shared/decorator/transform/trim';

@InputType()
export class CreatePost {
  @Field()
  @Length(3, 255)
  @Trim()
  title: string;

  @Field()
  @Trim()
  content: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsOptional()
  sources: string[];

  @Field(() => RefInput)
  @IsObject()
  category: Category;
}
