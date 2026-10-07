import { UNIQUE_TYPE_NAME_SEPARATOR } from '../../../constants';

/**
 * `react-docgen` tells the types it is resolving apart by their names only. Therefore, a type that wraps a type
 * of the same name imported from another file, e.g. `Props = Omit<LibraryProps, 'label'>` where `LibraryProps`
 * is an alias of an imported `Props`, would not be resolved. To prevent it, imported types get unique names.
 *
 * @param {Object} path The path to the imported value
 * @param {number} index The number that makes the name unique
 */
export const setUniqueTypeName = (path, index) => {
  const isUnique = path.isTSTypeAliasDeclaration() && path.node.id.name.includes(UNIQUE_TYPE_NAME_SEPARATOR);

  if (path.isTSTypeAliasDeclaration() && !isUnique) {
    // eslint-disable-next-line no-param-reassign
    path.node.id.name = `${path.node.id.name}${UNIQUE_TYPE_NAME_SEPARATOR}${index}`;
  }
};
