/**
 * @param {Object} tsType The type as described by `react-docgen`
 * @returns {boolean} Whether the type is an object, e.g. `{ top: number }`
 */
export const isObjectType = (tsType) => tsType.name === 'signature' && tsType.type === 'object';
