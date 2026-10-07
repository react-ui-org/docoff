/**
 * @param {string} value The string, e.g. `top` or `it's`
 * @returns {Object} The string literal type. It is written in single quotes, or in double quotes with escaped
 *   characters when the string contains quotes, e.g. `'top'` or `"it's"`, the same way as the literals that are read.
 */
export const createStringLiteral = (value) => {
  const json = JSON.stringify(value);

  return {
    name: 'literal',
    value: /['"]/.test(value) ? json : `'${json.slice(1, -1)}'`,
  };
};
