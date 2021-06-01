import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot({
      cors: false,
      sortSchema: true,
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => ({ headers: req.headers }),
    }),
  ],
  exports: [GraphQLModule],
})
export class AppGraphqlModule {}
