import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/module/misc/app-config/app-config.module';
import { AppTypeormModule } from 'src/module/misc/app-typeorm/app-typeorm.module';
import { AppGraphqlModule } from 'src/module/misc/app-graphql/app-graphql.module';
import { PostModule } from 'src/module/post/post.module';

@Module({
  imports: [AppConfigModule, AppTypeormModule, AppGraphqlModule, PostModule],
})
export class AppModule {}
