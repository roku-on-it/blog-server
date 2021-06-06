import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Module({
  imports: [
    GraphQLModule.forRoot({
      cors: false,
      sortSchema: true,
      autoSchemaFile: 'schema.gql',
      context: ({ req, res }) => ({ req, res }),
      formatError: (error: GraphQLError) => {
        return {
          message: error.message,
          extensions: error.extensions.exception.response,
        };
      },
    }),
  ],
  exports: [GraphQLModule],
})
export class AppGraphqlModule {}
