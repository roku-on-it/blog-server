import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { Trim } from 'src/module/shared/decorator/transform/trim';

@InputType()
export class CreateCategory {
  @Field()
  @Length(3, 255)
  @Trim()
  name: string;
}
