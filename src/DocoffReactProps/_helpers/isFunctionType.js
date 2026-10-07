/**
 * @param {Object} tsType The type as described by `react-docgen`
 * @returns {boolean} Whether the type is a function, e.g. `(value: string) => void`
 */
export const isFunctionType = (tsType) => tsType.name === 'signature' && tsType.type === 'function';
