/**
 * `react-docgen` does not resolve interfaces used as types, it only presents their names. Therefore, the interface
 * is replaced by a type alias of the same meaning, e.g. `interface Props extends BaseProps { label: string }`
 * by `type Props = BaseProps & { label: string }`.
 *
 * @param {Object} node The syntax tree node of the interface, it is changed in place so that it keeps its comments
 */
export const convertInterfaceToTypeAlias = (node) => {
  const extendedTypes = (node.extends ?? []).map((heritage) => ({
    end: heritage.end,
    loc: heritage.loc,
    start: heritage.start,
    type: 'TSTypeReference',
    typeName: heritage.expression,
    typeParameters: heritage.typeParameters,
  }));
  const typeLiteral = {
    end: node.body.end,
    loc: node.body.loc,
    members: node.body.body,
    start: node.body.start,
    type: 'TSTypeLiteral',
  };

  /* eslint-disable no-param-reassign */
  node.type = 'TSTypeAliasDeclaration';
  node.typeAnnotation = extendedTypes.length > 0
    ? {
      end: node.end,
      loc: node.loc,
      start: node.start,
      type: 'TSIntersectionType',
      types: [...extendedTypes, typeLiteral],
    }
    : typeLiteral;
  delete node.body;
  delete node.extends;
  /* eslint-enable no-param-reassign */
};
