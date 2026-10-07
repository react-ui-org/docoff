/**
 * @param {Object} node The syntax tree node
 * @returns {Object|null} The node whose `typeAnnotation` is the type described by the comment of the given node,
 *   `null` when the node does not define a type
 */
export const getTypeHolderNode = (node) => {
  if (node.type === 'TSTypeAliasDeclaration') {
    return node;
  }

  // The comment of an exported type alias belongs to the export
  if (node.type === 'ExportNamedDeclaration' && node.declaration?.type === 'TSTypeAliasDeclaration') {
    return node.declaration;
  }

  return node.type === 'TSPropertySignature' ? node.typeAnnotation : null;
};
