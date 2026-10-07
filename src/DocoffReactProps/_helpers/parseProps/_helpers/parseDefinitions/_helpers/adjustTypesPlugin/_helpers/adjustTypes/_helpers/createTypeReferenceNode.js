/**
 * `react-docgen` does not recognize some of the type syntax, e.g. it loses the `keyof` operator when it is used with
 * a type. Therefore, the syntax is replaced by a type of the given name with the original types as its arguments,
 * e.g. `keyof<Props>` instead of `keyof Props`, which is evaluated when it is presented.
 *
 * @param {Object} node The syntax tree node of the replaced syntax
 * @param {string} name The name of the type
 * @param {Object[]} typeNodes The syntax tree nodes of the arguments of the type
 * @returns {Object} The syntax tree node of the type reference
 */
export const createTypeReferenceNode = (node, name, typeNodes) => ({
  end: node.end,
  loc: node.loc,
  start: node.start,
  type: 'TSTypeReference',
  typeName: {
    name,
    type: 'Identifier',
  },
  typeParameters: {
    params: typeNodes,
    type: 'TSTypeParameterInstantiation',
  },
});
