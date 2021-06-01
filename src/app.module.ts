import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/module/misc/app-config/app-config.module';
import { AppTypeormModule } from 'src/module/misc/app-typeorm/app-typeorm.module';
import { AppGraphqlModule } from 'src/module/misc/app-graphql/app-graphql.module';
import { PostModule } from 'src/module/post/post.module';
import { AuthModule } from 'src/module/auth/auth.module';

@Module({
  imports: [
    AppConfigModule,
    AppTypeormModule,
    AppGraphqlModule,
    AuthModule,
    PostModule,
  ],
})
export class AppModule {}
