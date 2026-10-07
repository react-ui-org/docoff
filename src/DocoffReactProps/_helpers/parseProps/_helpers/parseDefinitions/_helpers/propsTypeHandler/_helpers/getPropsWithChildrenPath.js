import { utils } from 'react-docgen';

/**
 * `react-docgen` unwraps the type of props from `PropsWithChildren`, e.g. `PropsWithChildren<Props>` is found as
 * `Props`. The type is wrapped back, so that the `children` that `PropsWithChildren` adds are presented.
 *
 * @param {Object} typePath The path to the type of props as it is found by `react-docgen`
 * @returns {Object} The path to the `PropsWithChildren` the type is wrapped in, or the path to the type itself
 */
export const getPropsWithChildrenPath = (typePath) => {
  const typeReferencePath = typePath.parentPath?.parentPath;

  return typePath.parentPath?.isTSTypeParameterInstantiation()
    && typeReferencePath.isTSTypeReference()
    && utils.isReactBuiltinReference(typeReferencePath.get('typeName'), 'PropsWithChildren')
    ? getPropsWithChildrenPath(typeReferencePath)
    : typePath;
};
