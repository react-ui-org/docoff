/**
 * @param {Object} node The syntax tree node
 * @param {string} operator The operator, e.g. `keyof`
 * @returns {boolean} Whether the node is a type with the given operator, e.g. `keyof Props`
 */
export const isTypeOperator = (node, operator) => node.type === 'TSTypeOperator' && node.operator === operator;
