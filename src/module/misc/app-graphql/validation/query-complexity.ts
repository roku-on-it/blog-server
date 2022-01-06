import {
  ApolloServerPlugin,
  GraphQLServiceContext,
} from 'apollo-server-plugin-base';
import { GraphQLSchema, separateOperations } from 'graphql';
import { getComplexity, simpleEstimator } from 'graphql-query-complexity';

export class ComplexityPlugin implements ApolloServerPlugin {
  private schema: GraphQLSchema;

  constructor(private maxComplexity: number) {}

  public serverWillStart(service: GraphQLServiceContext) {
    this.schema = service.schema;
  }

  public requestDidStart() {
    return {
      didResolveOperation: ({ request, document }) => {
        const complexity = getComplexity({
          schema: this.schema,
          query: request.operationName
            ? separateOperations(document)[request.operationName]
            : document,
          variables: request.variables,
          estimators: [simpleEstimator({ defaultComplexity: 1 })],
        });
        if (complexity > this.maxComplexity) {
          throw new Error('too complex ' + complexity);
        }
      },
    };
  }
}
