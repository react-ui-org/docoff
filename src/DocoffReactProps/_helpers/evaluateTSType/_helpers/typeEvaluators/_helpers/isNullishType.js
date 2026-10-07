/**
 * @param {Object} tsType The type as described by `react-docgen`
 * @returns {boolean} Whether the type is `null` or `undefined`
 */
export const isNullishType = (tsType) => ['null', 'undefined'].includes(tsType.name);
