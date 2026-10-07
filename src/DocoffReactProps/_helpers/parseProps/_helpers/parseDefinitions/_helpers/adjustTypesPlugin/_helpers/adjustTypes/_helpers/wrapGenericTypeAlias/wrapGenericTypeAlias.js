import { hasTypeReference } from './_helpers/hasTypeReference';

/**
 * `react-docgen` remembers resolved types by their names only, so a generic type, e.g. `Responsive<Value>`, would
 * be resolved just once and the result would be used regardless of its type arguments. Types wrapped in a type
 * annotation are not remembered, so the generic type is resolved for each use of it.
 *
 * Types that refer to themselves are not wrapped, as remembering them prevents an endless loop.
 *
 * @param {Object} node The syntax tree node of the type alias, it is changed in place
 */
export const wrapGenericTypeAlias = (node) => {
  if (!node.typeParameters || hasTypeReference(node.typeAnnotation, node.id.name)) {
    return;
  }

  // eslint-disable-next-line no-param-reassign
  node.typeAnnotation = {
    end: node.typeAnnotation.end,
    loc: node.typeAnnotation.loc,
    start: node.typeAnnotation.start,
    type: 'TSTypeAnnotation',
    typeAnnotation: node.typeAnnotation,
  };
};
