import { Module } from '@nestjs/common';
import { PostResolver } from './post.resolver';
import { CategoryModule } from 'src/module/category/category.module';

@Module({
  imports: [CategoryModule],
  providers: [PostResolver],
})
export class PostModule {}
