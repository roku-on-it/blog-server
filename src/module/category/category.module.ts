import { Module } from '@nestjs/common';
import { CategoryResolver } from './category.resolver';

@Module({
  providers: [CategoryResolver],
})
export class CategoryModule {}
