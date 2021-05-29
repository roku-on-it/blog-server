import { registerEnumType } from '@nestjs/graphql';

export enum LanguageType {
  TR,
  EN,
}

registerEnumType(LanguageType, { name: 'LanguageType' });
