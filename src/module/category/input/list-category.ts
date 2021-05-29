import { Field, InputType } from '@nestjs/graphql';
import { FindManyOptions, ILike } from 'typeorm';
import { Category } from 'src/module/category/model/category';
import { LanguageType } from 'src/module/shared/model/enum/language-type.enum';

@InputType()
export class ListCategory {
  @Field({ nullable: true })
  query: string;

  @Field(() => LanguageType)
  language: LanguageType;

  async find(options?: FindManyOptions): Promise<Category[]> {
    if (null != this.query && this.query?.length) {
      return Category.find(
        options ?? {
          where: {
            language: this.language,
            name: ILike('%' + this.query + '%'),
          },
        },
      );
    }

    return Category.find(
      options ?? {
        where: {
          language: this.language ?? LanguageType.TR,
        },
      },
    );
  }
}
