/**
 * @param {*} node The syntax tree node, or any part of it
 * @param {string} name The name of the type
 * @returns {boolean} Whether the node refers to the type of the given name
 */
export const hasTypeReference = (node, name) => {
  if (Array.isArray(node)) {
    return node.some((item) => hasTypeReference(item, name));
  }

  if (typeof node?.type !== 'string') {
    return false;
  }

  return (node.type === 'TSTypeReference' && node.typeName.name === name)
    || Object.values(node).some((value) => hasTypeReference(value, name));
};
