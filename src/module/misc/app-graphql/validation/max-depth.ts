import { DocumentNode, GraphQLError, Kind } from 'graphql';

export const maxDepth = (maxDepth: number) => {
  return (validationContext) => {
    const { definitions } = validationContext.getDocument();
    const fragments = getFragments(definitions);
    const queries: DocumentNode = getQueriesAndMutations(definitions);
    const queryDepths = {};

    Object.keys(queries).forEach((key) => {
      queryDepths[key] = determineDepth(
        queries[key],
        fragments,
        0,
        maxDepth,
        validationContext,
      );
    });
    return validationContext;
  };
};

const getFragments = (definitions) => {
  return definitions.reduce((map, definition) => {
    if (definition.kind === Kind.FRAGMENT_DEFINITION) {
      map[definition.name.value] = definition;
    }
    return map;
  }, {});
};

const getQueriesAndMutations = (definitions) => {
  return definitions.reduce((map, definition) => {
    if (definition.kind === Kind.OPERATION_DEFINITION) {
      map[definition.name ? definition.name.value : ''] = definition;
    }
    return map;
  }, {});
};

const determineDepth = (
  node,
  fragments,
  depthSoFar: number,
  maxDepth: number,
  context,
) => {
  if (depthSoFar > maxDepth) {
    return context.reportError(
      new GraphQLError('Operation exceeds maximum depth of ' + maxDepth, [
        node,
      ]),
    );
  }

  switch (node.kind) {
    case Kind.FIELD:
      const shouldIgnore = /^__/.test(node.name.value) || false;

      if (shouldIgnore || !node.selectionSet) {
        return 0;
      }
      return (
        1 +
        Math.max(
          ...node.selectionSet.selections.map((selection) =>
            determineDepth(
              selection,
              fragments,
              depthSoFar + 1,
              maxDepth,
              context,
            ),
          ),
        )
      );
    case Kind.FRAGMENT_SPREAD:
      return determineDepth(
        fragments[node.name.value],
        fragments,
        depthSoFar,
        maxDepth,
        context,
      );
    case Kind.INLINE_FRAGMENT:
    case Kind.FRAGMENT_DEFINITION:
    case Kind.OPERATION_DEFINITION:
      return Math.max(
        ...node.selectionSet.selections.map((selection) =>
          determineDepth(selection, fragments, depthSoFar, maxDepth, context),
        ),
      );
    default:
      throw new Error('Depth crawler cannot handle: ' + node.kind);
  }
};
