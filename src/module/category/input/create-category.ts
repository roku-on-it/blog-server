import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, Length } from 'class-validator';
import { LanguageType } from 'src/module/shared/model/enum/language-type.enum';
import { Trim } from 'src/module/shared/decorator/transform/trim';

@InputType()
export class CreateCategory {
  @Field()
  @Length(3, 255)
  @Trim()
  name: string;

  @Field(() => LanguageType)
  @IsEnum(LanguageType)
  language: LanguageType;
}
