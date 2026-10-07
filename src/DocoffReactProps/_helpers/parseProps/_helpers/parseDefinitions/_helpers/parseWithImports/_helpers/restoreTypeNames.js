import { getOriginalTypeName } from './getOriginalTypeName';

/**
 * Restores the names of types that were made unique by the importer.
 *
 * @param {*} value What `react-docgen` found, or any part of it
 * @returns {*} The same value with the names of types as they are written in the source code
 */
export const restoreTypeNames = (value) => {
  if (Array.isArray(value)) {
    return value.map(restoreTypeNames);
  }

  if (value === null || typeof value !== 'object') {
    return value;
  }

  return Object.fromEntries(Object.entries(value).map(([key, item]) => [
    key,
    key === 'name' && typeof item === 'string' ? getOriginalTypeName(item) : restoreTypeNames(item),
  ]));
};
