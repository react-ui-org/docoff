import { isFunctionType } from '../../isFunctionType';

/**
 * @param {Object} tsType The type as described by `react-docgen`
 * @returns {boolean} Whether the type must be enclosed in parentheses when it is the type of items of an array
 */
export const isCompoundType = (tsType) => isFunctionType(tsType) || ['intersection', 'union'].includes(tsType.name);
