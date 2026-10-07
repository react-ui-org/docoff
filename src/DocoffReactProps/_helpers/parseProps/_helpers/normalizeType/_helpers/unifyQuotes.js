const IDENTIFIER_REGEX = /^[A-Za-z_$][\w$]*$/;

/**
 * @param {string} value The value of a literal as it is written, e.g. `"small"`. Keys of an object read by `keyof`,
 *   e.g. `keyof typeof sizes`, are written without quotes by `react-docgen` when they are identifiers, e.g. `small`.
 * @returns {string} The value in single quotes when it is a string, e.g. `'small'`
 */
export const unifyQuotes = (value) => {
  if (/^"[^'"]*"$/.test(value)) {
    return `'${value.slice(1, -1)}'`;
  }

  return IDENTIFIER_REGEX.test(value) && !['true', 'false'].includes(value) ? `'${value}'` : value;
};
