/**
 * @param {Object} tsType The type as described by `react-docgen`
 * @returns {boolean} Whether the type is a string literal, e.g. `'top'`
 */
export const isStringLiteral = (tsType) => tsType.name === 'literal' && /^(['"]).*\1$/.test(tsType.value);
